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
import HomePageStepper from './homePageStepper.js';

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
        position:'fixed',
        left:0
    },
    content: {
        marginTop:'100px',
        height:'calc(100% - 100px)',
        paddingLeft: theme.spacing.unit * 3.5,
        paddingRight: theme.spacing.unit * 3.5,

    },
    contentText:{
        //color:'#FF7504',
        textAlign: 'justify',
    },
    emergencyText:{
        color:'Red',
        textAlign: 'center',
    },
    // headerTitle:{
    //     marginLeft: `calc( 100% - 80% )`,        
    // },
    paper: {
        position: 'absolute',
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
class AboutUs extends React.Component{
    render(){
        const { classes,theme } = this.props;
        return(
            
            <Paper className={classes.paper}>
                
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
                    <HomePageStepper />

                    
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