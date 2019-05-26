import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { createBrowserHistory, createHashHistory } from 'history';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

import { Router, Route, Link } from "react-router-dom";
import { Toolbar } from '@material-ui/core';

const styles = theme => ({
    backButton:{
        color: '#FFFFFF',
        zIndex: 1210,
        position:'fixed',
        left:0
    },
    content: {
        justifyContent: 'center',
        marginTop:'100px',
        paddingLeft: theme.spacing.unit * 3.5,
        paddingRight: theme.spacing.unit * 3.5
    },
    contentText:{
        textAlign: 'justify'
    },
    emergencyText:{
        color:'Red',
        textAlign: 'center',
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
        display:'flex',
        justifyContent:'center',
    },
});

class ContactUs extends React.Component{
    render(){
        const { classes,theme } = this.props;
        return(
            <Paper className={classes.paper}>
                
                <div>
                    <AppBar
                            position="fixed"
                            className={classes.appBar}
                            color="secondary"
                    >
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.backButton} onClick={()=>{this.props.history.goBack()}}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                            <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.headerTitle}
                            >
                                Contact Us
                        </Typography>
                        </Toolbar>
                        
                    </AppBar>
                    <div className={classes.content}>
                        <Typography className={classes.contentText} variant='h6'>
                            We are happy to help and welcome any feedback. Get in touch with us through our email. Ask us questions, give feedback, suggest interesting features or just appreciate us!
                        </Typography>
                        <br/>
                        <Typography className={classes.contentText} variant='h6'>
                            Email Id: <span style={{color:"#4f6c98"}}>gosecuro@gmail.com</span>
                        </Typography>
                    </div>
                    
                </div>
                </Paper>
        );
    }
}

ContactUs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(ContactUs);