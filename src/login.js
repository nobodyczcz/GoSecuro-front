import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

import APIs from './apis.js';
import { ValidatorForm, SelectValidator, TextValidator } from 'react-material-ui-form-validator';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    paper: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        width: "100%",
        height: "100%",
    },
    textField: {
        width: "100%",
        marginTop: 0,
    },
    logoarea: {
        display: 'flex',
        height:"30%",
        marginTop:'20%',
        justifyContent: 'center',
    },
    logo: {
        width:'auto',
        height:'100%',
    },
    content: {
        padding: "5%",
    },
    button: {
        marginTop:"10px",
        width: "100%",
        height: "30px",
        marginBottom: "10px",
    },
    signup: {
        display:"flex",
        justifyContent: 'center',
    },
    progress: {
        width:"20px"
    }
});
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            displayError:false,
            firstName: "",
            lastName: "",
            mobileNumber: "",
            email: "",
            gender: '',
            password: "",
            confirmPassword: "",
            error: [],
            logining:false,

        };

    }

   

    handleClickNext = () => {
        console.log(window.serverUrl);
        var regdata = {
            grant_type: "password",
            userName: this.state.mobileNumber,
            password: this.state.password,
        };
        this.apis.login(regdata, this.loginSuccess.bind(this), this.loginError.bind(this))
        this.setState({ logining: true, displayError: false });
    }

    loginSuccess(data) {
        console.log("Success")
        //this.apis.setToken(data.access_token);
        this.props.handleLogin();
        this.props.history.goBack();
        
        //jump to next page
    }

    loginError(jqXHR) {
        this.state.errors = [];
        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) this.state.errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) this.state.errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) this.state.errors.push(response.error);
            if (response.error_description) this.state.errors.push(response.error_description);
        }
        console.log(this.state.errors)
        this.setState({ logining: false,displayError:true })
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };


    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>

                <div className={classes.logoarea}>
                    <img className={classes.logo} src="img/icon.png"/>
                </div>
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

                        <Grid item xs={12} md={6}>
                            <TextValidator
                                id="mobile"
                                label="Mobile Number*"
                                className={classes.textField}
                                value={this.state.mobileNumber}
                                type='number'
                                validators={['required', 'isNumber']}
                                errorMessages={['Mobile number is required', "Numbers only"]}
                                onChange={this.handleChange('mobileNumber')}
                                margin="normal"
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextValidator
                                id="password"
                                label="Pasword*"
                                className={classes.textField}
                                value={this.state.password}
                                type="password"
                                validators={['required']}
                                errorMessages={['Password is required']}
                                onChange={this.handleChange('password')}
                                margin="normal"
                            />
                            {this.state.displayError ? <Typography color="secondary" variant="body2">The user name or password is incorrect.</Typography> : null}
                        </Grid>

                        <Grid item xs={12}>
                            <Fab
                                variant="extended"
                                className={classes.button}
                                color="secondary"
                                type="submit"
                                form="theForm"
                            >
                                LOGIN
                                {this.state.logining ? <CircularProgress size={20} color="primary" />:null}
                                
                        </Fab>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.signup}>
                                <a>Don't have an account?</a>
                                <Link to="/register"> Sign Up</Link>
                            </div>
                            

                            
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2"></Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Button size="small" className={classes.button} onClick={() => { this.props.history.goBack()}}>
                                SKIP FOR NOW
                            </Button>
                            
                        </Grid>

                    </Grid>

                    
                </ValidatorForm>


            </Paper>

        );
    }
}

export default withStyles(styles)(LoginPage);