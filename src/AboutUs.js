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

var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}

const styles = theme => ({
    // appBar: {
    //     transition: theme.transitions.create(['margin', 'width'], {
    //       easing: theme.transitions.easing.sharp,
    //       duration: theme.transitions.duration.leavingScreen,
    //     }),
        //backgroundColor:'#fffafa'
    //},
    backButton:{
        color: '#FFFFFF',
        zIndex: 1210,
    },
    content: {
        justifyContent: 'center',
        marginTop:'100px',
        paddingLeft: theme.spacing.unit * 3.5,
        paddingRight: theme.spacing.unit * 3.5
    },
    contentText:{
        //color:'#FF7504',
        textAlign: 'justify'
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
});
class AboutUs extends React.Component{
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
                                About Us
                        </Typography>
                        </Toolbar>
                        
                    </AppBar>
                    <div className={classes.content}>
                    <Typography className={classes.contentText} variant='h6'>
                        Crime and offences in public spaces have continued to threaten the safety of women, discouraging them to travel alone confidently.
                        <br/><br/>
                        This situation is particularly intimidating to female students who are new and unfamiliar to Melbourne. It is a social responsibility to ensure the safety of women and encourage them to travel confidently. 
                        <br/><br/>
                        GoSecuro is a safety app targeted towards new students in Melbourne. The application is developed with your safety in mind. 
                        <br/><br/>
                        GoSecuro acts as an additional safety measure when you’re navigating Melbourne, crime and incidents.
                    </Typography>
                    </div>
                    
                </div>
            </Paper>
            
        );
    }
}

AboutUs.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(AboutUs);