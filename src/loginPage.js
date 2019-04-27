import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { createBrowserHistory, createHashHistory } from 'history';
import IconButton from '@material-ui/core/IconButton';
import APIs from './apis.js';
import { Toolbar } from '@material-ui/core';
import { ValidatorForm, SelectValidator, TextValidator } from 'react-material-ui-form-validator';
import { withStyles } from '@material-ui/core/styles';
import { Router, Route, Link } from "react-router-dom";


var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}

const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor:'#fffafa'
    },
    backButton:{
        color: '#FF7504',
        zIndex: 1210

    },
    headerTitle:{
        align:'center',
        position: 'absolute',
        marginTop: theme.spacing.unit * 1.5,
        paddingLeft: `calc(100% - 75%)`
        
    },
    form:{
        marginTop: theme.spacing.unit * 4,
    },
    navHeader: {
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
      },
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
        width: '100%',
        display: 'flex',

        justifyContent: 'center',
    },
    logo: {
        marginTop:'20%',
        maxHeight:'300px'
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
    }
});
class SideLoginPage extends React.Component {
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
        const { classes,theme } = this.props;
        return (
            <Router history={history}>
            <Paper className={classes.paper}>

                <AppBar
                    position="fixed"
                    className={classes.appBar}
                >
                <Toolbar className={classes.navHeader}>
                    <IconButton className={classes.backButton} onClick={()=>{this.props.history.goBack()}}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </Toolbar>
                <Typography className={classes.headerTitle} variant="h5" color="Black" noWrap>
                        Sign Up or Login
                </Typography>
                    
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

                        <Grid xs={12}>
                            <Fab
                                variant="extended"
                                className={classes.button}
                                color="secondary"
                                type="submit"
                                form="theForm"
                            >
                                LOGIN
                        </Fab>
                        </Grid>
                        <Grid xs={12}>
                            <div className={classes.signup}>
                                <a>Don't have an account?</a>
                                <Link to="/register"> Sign Up</Link>
                            </div>
                            

                            
                        </Grid>
                        <Grid xs={12}>
                            <Typography variant="body2"></Typography>
                        </Grid>

                        <Grid xs={12}>
                            <Button size="small" className={classes.button} onClick={() => { this.props.history.push("/")}}>
                                SKIP FOR NOW
                            </Button>
                            
                        </Grid>

                    </Grid>

                    
                </ValidatorForm>


            </Paper>
            </Router>

        );
    }
}

export default withStyles(styles, { withTheme: true })(SideLoginPage);