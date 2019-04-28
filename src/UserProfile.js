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
        padding: '0',
        marginTop: '80px'
    },
    contentText:{
        color:'#FF7504',
        textAlign: 'justify'
    },
    contCard: {
        padding:"5%",
        marginBottom:theme.spacing.unit * 2,
    },
    emergencyText:{
        color:'Red',
        textAlign: 'center',
    },
    headerTitle:{
        align:'center',
        position: 'absolute',
        marginTop: theme.spacing.unit * 1.5,
        paddingLeft: '35%'
        
    },
    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex:1200,
    },
    navHeader: {
        padding: 0,
        marginLeft: 0,
        marginRight: 0,
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
    }
});
class UserProfile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: 'Sushmitha',
            contact: '111',
            email: 'www',
            gender: 'f',
            name: '',
            mobile: '',
            open:false,
            isreadOnly: true,
            contactList:[]
        };

    }

    handleEditClick(){
        this.state.isreadOnly = false;
    }
    render(){
        const { classes,theme } = this.props;
        
        return(
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
                            User Profile
                        </Typography>
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
                        <Grid item xs={12} md={6} lg={3}>
                            <EditIcon
                                className={classes.editIconButton}
                                color="secondary"
                                fill="secondary"
                                float="right"
                                onClick={this.handleEditClick} 
                            >
                            </EditIcon>
                            <Card className={classes.contCard} >
                                <CardContent>
                                    <Typography className={classes.label} variant='h6'>
                                        Username
                                    </Typography>
                                    <TextField
                                        id="userName"
                                        className={classes.textField}
                                        value={this.state.userName}
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
                                        id="cantactNumber"
                                        className={classes.textField}
                                        value={this.state.contact}
                                        type='number'
                                        inputProps={{
                                            maxlength:'10',
                                            readOnly: this.state.isreadOnly
                                        }}
                                        margin="normal"
                                    />
                                    <Typography className={classes.label} variant='h6'>
                                        Email Id
                                    </Typography>
                                    <TextField
                                        id="email"
                                        className={classes.textField}
                                        value={this.state.email}
                                        type='text'
                                        inputProps={{
                                            maxlength:'10',
                                            readOnly: this.state.isreadOnly
                                        }}
                                        margin="normal"
                                    />
                                    <Typography className={classes.label} variant='h6'>
                                        Gender
                                    </Typography>
                                    <TextField
                                        id="gender"
                                        className={classes.textField}
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
                                        value={this.state.gender}
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
                        </Grid>
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