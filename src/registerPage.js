import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import APIs from './apis.js';
import { Fade } from '@material-ui/core';

import { createBrowserHistory, createHashHistory } from 'history';
import { Router, Route, Link } from "react-router-dom";
import { ValidatorForm, SelectValidator,TextValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}

const styles = theme => ({
    paper: {
        position:'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        width: "100%",
        height:"100%",
    },
    textField: {
        width: "100%",
        marginTop:0,
    },
    selectAge: {
        minWidth:"100px",
    },
    toolbar: {
        justifyContent: "center",
        marginTop:"20px",
    },
    content: {
        padding: "5%",
    },
    buttons: {
        position: "fixed",
        bottom: 0,
        width:"90%",
        padding: "5%",
        display:"flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        minWidth: "100px",
    }
});
class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            firstName: "",
            lastName: "",
            mobileNumber: "",
            address:'',
            email: "",
            gender: '',
            password: "",
            confirmPassword: "",
            error: false,
            errorMsg: "",
            loading:false

        };

    }

    componentDidMount() {
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== this.state.password) {
                return false;
            }
            return true;
        });
        ValidatorForm.addValidationRule('hasSpecialChar', (value) => {
            if (!/[^a-z0-9]/.test(value)) {
                return false;
            }
            
            return true;
        });
        ValidatorForm.addValidationRule('hasLetter', (value) => {
            if (!/[a-zA-Z]/.test(value)) {
                return false;
            }

            return true;
        });
        ValidatorForm.addValidationRule('hasNumber', (value) => {
            if (!/[0-9]/.test(value)) {
                return false;
            }

            return true;
        });

    }

    handleClickNext = () => {
        console.log(window.serverUrl);
        var regdata = {
            Phone: this.state.mobileNumber,
            Email: this.state.email,
            Adress:this.state.address,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Gender: this.state.gender,
            Password: this.state.password,
            ConfirmPassword: this.state.password,
            regSuccessNotification: false,
            
        };
        this.apis.register(regdata, this.regSuccess.bind(this), this.regError.bind(this))
        
        this.setState({ error: false,loading:true });

        //jump to next page: 
        
    }

    regSuccess(data) {
        console.log("User successfully registered.")
        //jump to next page: add emergency contacts page
        this.setState({ regSuccessNotification: true})
        var logindata = {
            grant_type: "password",
            userName: this.state.mobileNumber,
            password: this.state.password
        };
        this.apis.login(logindata,this.loginSuccess.bind(this),this.regError.bind(this))

    }

    loginSuccess(data) {
        console.log("User successfully logged in.")
        //jump to next page: add emergency contacts page
        this.props.handleLogin() //tell app.js that we successful login
        this.props.history.push('/emergencyContact');
    }

    regError(jqXHR) {
        var errors = [];
        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) errors.push(response.error);
            if (response.error_description) errors.push(response.error_description);
        }

        this.setState({ error: true, errorMsg: JSON.stringify(errors).replace("Name","Phone"), loading: false})
        console.log(errors)
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ regSuccessNotification: false });
    };


    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <AppBar color="secondary" position="static">
                    <Toolbar className={classes.toolbar}>
                        <Typography
                            variant="h6"
                            color="inherit"
                            >
                            Register
                        </Typography>
                    </Toolbar>
                </AppBar>
                <ValidatorForm
                    ref="theForm"
                    id="theForm"
                    onSubmit={this.handleClickNext}
                    onError={errors => console.log(errors)}

                    className={classes.form}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={8}
                        className={classes.content}
                    >
                        <Grid item xs={6} md={6} lg={3}>
                            <TextValidator
                                id="firstName"
                                label="First Name*"
                                className={classes.textField}
                                value={this.state.firstName}
                                onChange={this.handleChange('firstName')}
                                validators={['required','trim','isString']}
                                errorMessages={['First Name is required','no spaces around name','String only']}
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={6} md={6} lg={3}>
                            <TextValidator
                                id="lastName"
                                label="Last Name"
                                className={classes.textField}
                                value={this.state.lastName}

                                onChange={this.handleChange('lastName')}
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextValidator
                                id="mobile"
                                label="Mobile Number*"
                                className={classes.textField}
                                value={this.state.mobileNumber}
                                type='number'
                                validators={['required','isNumber']}
                                errorMessages={['Mobile number is required',"Numbers only"]}
                                onChange={this.handleChange('mobileNumber')}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="gender">Gender</InputLabel>
                                <Select
                                    value={this.state.gender}
                                    onChange={this.handleChange('gender')}
                                    name="gender"
                                    inputProps={{
                                        id: 'gender',
                                    }}
                                    className={classes.selectAge}
                                >
                                    <MenuItem value={"None"}>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={"male"}>Male</MenuItem>
                                    <MenuItem value={"female"}>Female</MenuItem>
                                    <MenuItem value={"neither"}>Neither</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextValidator
                                id="address"
                                label="Address"
                                className={classes.textField}
                                value={this.state.address}
                                onChange={this.handleChange('address')}
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12} md={6} lg={3}>
                            <TextValidator
                                id="email"
                                label="Email*"
                                className={classes.textField}
                                value={this.state.name}
                                type="email"
                                onChange={this.handleChange('email')}
                                margin="normal"
                                validators={['isEmail']}
                                errorMessages={ ['email is not valid']}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextValidator
                                id="password"
                                label="Pasword*"
                                className={classes.textField}
                                value={this.state.password}
                                type="password"
                                validators={['hasLetter', 'hasSpecialChar', 'hasNumber','minStringLength:6','required']}
                                errorMessages={ ['Must have at least one letter','Must have at least one special charactor','Must have at least one number','Length longer than 6','Password is required']}
                                onChange={this.handleChange('password')}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <TextValidator
                                id="confirmPassword*"
                                label="Comfirm Password"
                                className={classes.textField}
                                value={this.state.confirmPassword}
                                type="password"
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['password mismatch', 'Confirm password is required']}
                                onChange={this.handleChange('confirmPassword')}
                                margin="normal"
                            />
                        </Grid>
                        <Grid>
                            <Typography variant="body2">Password must contain at least one number, one letter and one special charactor.The length must longer than 6.</Typography>
                        </Grid>
                        {this.state.error ? <Grid>
                            <Typography variant="body2" color='secondary'>{this.state.errorMsg}</Typography>
                        </Grid>:null}
                    </Grid>
                
                    <span className={classes.buttons}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            onClick={() => { this.props.history.goBack()}}
                        >
                            Cancel
                        </Button>
                        {this.state.loading ? <CircularProgress size={30} color="secondary" /> : null}
                        <Button
                            style={{ float: "right" }}
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            type="submit"
                            form= "theForm"
                        >
                            Register
                        </Button>
                    </span>
                </ValidatorForm>
                <Snackbar
                    anchorOrigin={{ vertical : 'bottom', horizontal: 'center' }}
                    open={this.state.regSuccessNotification}
                    autoHideDuration={4000}
                    TransitionComponent={Fade}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Registered successfully.</span>}
                    action={[
                        <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={this.handleClose}
                        >
                        <CloseIcon />
                        </IconButton>,
                    ]}
                />


            </Paper>

        );
    }
}

export default withStyles(styles)(RegisterPage);