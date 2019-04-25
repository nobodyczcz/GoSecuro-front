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
    selectAge: {
        minWidth: "100px",
    },
    toolbar: {
        justifyContent: "center",
        marginTop: "20px",
    },
    content: {
        padding: "5%",
    },
    buttons: {
        position: "fixed",
        bottom: 0,
        width: "90%",
        padding: "5%",
        justifyItems: "space-between"
    },
    button: {
        minWidth: "100px",
    }
});
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            firstName: "",
            lastName: "",
            mobileNumber: "",
            email: "",
            gender: '',
            password: "",
            confirmPassword: "",
            error: [],

        };

    }

   

    handleClickNext = () => {
        console.log(window.serverUrl);
        var regdata = {
            Phone: this.state.mobileNumber,
            Password: this.state.password,
        };
        this.apis.login(regdata, this.regSuccess.bind(this), this.regError.bind(this))
    }

    regSuccess(data) {
        console.log("Success")
        //jump to next page
    }

    regError(jqXHR) {
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
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };


    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>

               
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
                        </Grid>
                    </Grid>

                    <Grid xs={12}>
                        <Button
                            style={{ float: "center" }}
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            type="submit"
                            form="theForm"
                        >
                            Next
                        </Button>
                    </Grid>
                </ValidatorForm>


            </Paper>

        );
    }
}

export default withStyles(styles)(Login);