import React, { Component } from 'react';
import MapController from './mapController.js';
import PropTypes from 'prop-types';
import APIs from './apis.js';

import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { Toolbar } from '@material-ui/core';
import { createBrowserHistory, createHashHistory } from 'history';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    backButton:{
        color: '#FFFFFF',
        zIndex: 1210,
    },
    headerTitle:{
        marginLeft: `calc( 100% - 80% )`,        
    },
    toolbar: {
        marginTop:"20px",
    },

});

class ShowPins extends Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.mapController = new MapController();
        this.pins = []

        this.state = {
            //Indicates if a user has any existing dropped Pins
            isExistingPins: false
        };

    }

    renderMap(){
        const google = window.google
        this.map = new google.maps.Map(document.getElementById('MAP'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
            disableDefaultUI: true,
            scaleControl: true,
        });
    }

    retrievePins(){
        console.log(window.serverUrl);
        console.log("Retrieving user pins");
        var apiRoute = 'api/Pin/Retrieve';
        if (this.props.isLogin)
            this.apis.callApi(apiRoute,'',this.retrieveSuccess.bind(this),this.regError.bind(this));
    
    }

    retrieveSuccess(reply) {
        console.log("Pins retrieved successfully")
        console.log(reply)
        var userPins = JSON.parse(reply.data);
        console.log(userPins);
        if(userPins.length===0){
            return
        }
        else{
            this.setState({isExistingPins : true},()=>{
                this.pins =this.pins.concat(userPins);
        

                //Displays pins dropped by registered user
                this.mapController.showPins(this.props.map,this.pins);   
            });
        }
        
        
        
    }

    regError(errorResponse) {
        console.log(errorResponse);
        
    }

    componentWillMount(){
        this.retrievePins();
        this.props.hideAppBar(true);

    }
    
    handleBack = () =>{
        this.props.history.goBack();
    }

    componentWillUnmount(){
        if(this.state.isExistingPins){
            this.mapController.clearPins();  
        }

    }

    render(){
        const {classes, theme} = this.props;
        return(
            <div>
                    <AppBar
                            position="fixed"
                            className={classes.appBar}
                            color="secondary"
                    >
                        <Toolbar className={classes.toolbar}>
                            <IconButton className={classes.backButton} onClick={this.handleBack}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                            <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.headerTitle}
                            >
                                My Pins
                        </Typography>
                        </Toolbar>
                        
                    </AppBar>
                    
                </div>
        );
    }
}

ShowPins.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(ShowPins);