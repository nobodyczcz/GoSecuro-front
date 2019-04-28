import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { createBrowserHistory, createHashHistory } from 'history';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import APIs from './apis.js';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Router, Route, Link } from "react-router-dom";
import { Toolbar } from '@material-ui/core';

var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}

function EditIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="1.5em" 
            height="1.5em" 
            viewBox="0 0 24 24"
            {...props}
        >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
    );
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
    buttons: {
        position: "fixed",
        bottom: 0,
        width:"90%",
        padding: "5%",
        justifyItems:"space-between"
    },
    button: {
        minWidth: "100px",
    },
    content: {
        padding: '5%',
        marginTop: '80px',
        overflowY: "scroll",
    },
    contentText:{
        color:'#FF7504',
        textAlign: 'justify'
    },
    contCard: {
        padding:"5%",
        marginBottom:theme.spacing.unit * 2,
    },
    editIconButton:{
        top: `calc( 100% - 90% )`,
        transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        opacity: '1',
        fill: '#FF7504',
        paddingLeft: `calc( 100% - 10% )`
    },
    emergencyText:{
        color:'Red',
        textAlign: 'center',
    },
    headerTitle:{
        marginLeft: `calc( 100% - 80% )`,        
    },
    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex:1200,
    },
    toolbar: {
        marginTop:"20px",
    },
    textField: {
        width: "100%",
        marginTop:0,
    },
    profile: {
        marginTop: '100px',
    },
    label: {
        color: '#FF7504'
    },
    progress: {
        marginLeft: theme.spacing.unit * 20,
        padding: '5px'
      },
});
class UserProfile extends React.Component{
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            firstName: '',
            lastName: '',
            phone: '111',
            email: 'www',
            gender: 'f',
            address: '',
            open:false,
            isreadOnly: true,
            showButtons: 'none',
            userProfile:[],
            isLoading: true
        };

    }

    componentDidMount(){
        this.retrieveUserProfile();
    }

    editSuccess(reply) {
        console.log("User profile Edit successfull!")
        //jump to next page
    }

    handleEdit() {
        console.log(window.serverUrl);
        console.log("Editing user profile");
        
        if (this.props.isLogin) {
            var apiRoute = 'api/UserProfiles/EditProfiles';
            var userData = {
            Address: this.state.adress,
            Gender: this.state.gender,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            Phone: this.state.phone,
            Email: this.state.email
            };
            console.log("[INFO]already login")
            this.apis.callApi(apiRoute, userData, this.editSuccess.bind(this), this.retError);
        }
    }

    handleEditCancel() {
        this.setState({ isreadOnly: true, showButtons: 'none' })     

    }

    handleEditClick(){
        this.setState({ isreadOnly: false, showButtons: 'inherit'})     
    }

    retrieveUserProfile(){
        this.setState({ isLoading: true });
        console.log(window.serverUrl);
        console.log("Retrieving user profile");
        var apiRoute = 'api/UserProfiles/Retrieve';
        if (this.props.isLogin) {
            console.log("[INFO]already login")
            this.apis.callApi(apiRoute, '', this.retrieveSuccess.bind(this), this.retError);
        }
            
    }

    retrieveSuccess(reply) {
        console.log("User profile successfully retrieved")
        console.log("user profile: " + JSON.parse(reply.data));
        console.log(JSON.parse(reply.data));
        this.setState({userProfile : JSON.parse(reply.data), isLoading: false}); 

        //jump to next page
    }

    retError(jqXHR) {
        this.setState({ errors : []});
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

    render(){
        const { classes,theme } = this.props;
        
        return(
            <Paper className={classes.paper}>
                
                
                    <AppBar
                            position="fixed"
                            className={classes.appBar}
                    >
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.backButton} onClick={()=>{this.props.history.goBack()}}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                            <Typography className={classes.headerTitle} variant="h5" color="Black" noWrap>
                            User Profile
                        </Typography>
                        </Toolbar>
                        
                    </AppBar>
                    <div classNames={classes.profile}>
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={8}
                        className={classes.content}
                    >
                        {this.state.isLoading ? <CircularProgress size={30} color="secondary" className={classes.progress} />:null}
                     
                        {this.state.userProfile.map(function (item, i) {
                            return(
                                <Grid item xs={12} md={6} lg={3}>
                                    <EditIcon
                                        className={classes.editIconButton}
                                        color="secondary"
                                        fill="secondary"
                                        float="right"
                                        onClick={this.handleEditClick.bind(this)} 
                                    >
                                    </EditIcon>
                                    <Card className={classes.contCard} >
                                        <CardContent>
                                            <Typography className={classes.label} variant='h6'>
                                                First Name
                                            </Typography>
                                            <TextField
                                                id="FirstName"
                                                className={classes.textField}
                                                defaultValue={item.FirstName}
                                                value={this.state.firstName}
                                                type='text'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: this.state.isreadOnly
                                                }}
                                                margin="normal"
                                            />
                                            <Typography className={classes.label} variant='h6'>
                                                Last Name
                                            </Typography>
                                            <TextField
                                                id="LastName"
                                                className={classes.textField}
                                                defaultValue={item.LastName}
                                                value={this.state.lastName}
                                                type='text'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: this.state.isreadOnly
                                                }}
                                                margin="normal"
                                            />
                                            <Typography className={classes.label} variant='h6'>
                                                Phone Number
                                            </Typography>
                                            <TextField
                                                id="PhoneNumber"
                                                className={classes.textField}
                                                defaultValue={item.Phone}
                                                value={this.state.phone}
                                                type='number'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: true
                                                }}
                                                margin="normal"
                                            />
                                            <Typography className={classes.label} variant='h6'>
                                                Email Id
                                            </Typography>
                                            <TextField
                                                id="EmailId"
                                                className={classes.textField}
                                                defaultValue={item.Email}
                                                value={this.state.email}
                                                type='text'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: true
                                                }}
                                                margin="normal"
                                            />
                                            <Typography className={classes.label} variant='h6'>
                                                Gender
                                            </Typography>
                                            <TextField
                                                id="gender"
                                                className={classes.textField}
                                                defaultValue={item.Gender}
                                                value={this.state.gender}
                                                type='text'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: this.state.isreadOnly
                                                }}
                                                margin="normal"
                                            />
                                            <Typography className={classes.label} variant='h6'>
                                                Address
                                            </Typography>
                                            <TextField
                                                id="gender"
                                                className={classes.textField}
                                                defaultValue={item.Address}
                                                value={this.state.address}
                                                type='text'
                                                inputProps={{
                                                    maxlength:'10',
                                                    readOnly: this.state.isreadOnly
                                                }}
                                                margin="normal"
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        }.bind(this))}
                        </Grid>
                        <span className={classes.buttons}
                            style= {{display:'none'}}>
                            <Button
                                variant="contained"
                                className={classes.button}
                                color="secondary"
                                onClick={this.handleEditCancel.bind(this)}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ float: "right" }}
                                variant="contained"
                                className={classes.button}
                                color="secondary"
                                onClick={()=>{this.props.history.push('/')}}
                            >
                                Save
                            </Button>
                        </span>  
                    </div>

            </Paper>
        );
    }

}

UserProfile.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(UserProfile);