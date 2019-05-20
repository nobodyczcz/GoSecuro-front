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
import Switch from '@material-ui/core/Switch';
import App from './App.js';
import Select from '@material-ui/core/Select';

import MapController from './mapController.js';
import MenuItem from '@material-ui/core/MenuItem';
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
        position:'fixed',
        left:'0',
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
    
    headerTitle:{
        marginLeft: `calc( 100% - 80% )`,        
    },
    menuItem: {
        display: 'flex',
        justifyContent: "space-between",
        //fontSize: '10px',
        fontWeight: "bold",
        padding:"8px"
    },
    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex:1200,
    },
    switchButton:{
        padding:'0',
        float:'right'
    },
    toolbar: {
        marginTop:"20px",
        display:'flex',
        justifyContent:"center"
    },
});
class SettingsPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            heatMapSwitch: true,
            showRouteSwitch: false,
            interval:600000,

        };
        this.mapController = new MapController();
    }

    componentWillMount(){
        this.props.hideAppBar(true);
        // load current setting from local storage. If don't exist, give a default value
        if (localStorage.displayHeatMap){
            this.state.heatMapSwitch=localStorage.displayHeatMap==='true'
        }
        else{
            this.state.heatMapSwitch=true
            localStorage.setItem('displayHeatMap', true);
        }

        if (localStorage.shareRoute){
            this.state.showRouteSwitch=localStorage.shareRoute==='true'
        }
        else{
            this.state.heatMapSwitch=false
            localStorage.setItem('shareRoute', false);
        }

        if (localStorage.secureCheckInterval){
            this.state.interval = parseInt(localStorage.secureCheckInterval)
        }
        else{
            this.state.interval=600000
            localStorage.setItem('secureCheckInterval', 600000);
        }

    }
    handleHeatMapSwitch(){

        if (!this.state.heatMapSwitch) {
            //Turn on Heat map          

            localStorage.setItem('displayHeatMap', true);
            this.setState({ heatMapSwitch: !this.state.heatMapSwitch });
        }
        else {
            //Turn off heatmap

            localStorage.setItem('displayHeatMap', false);
            this.setState({ heatMapSwitch: !this.state.heatMapSwitch });
        }
    }

    handleShowRouteSwitch(){

        if (!this.state.showRouteSwitch) {
            //Turn on Heat map          

            localStorage.setItem('shareRoute', true);
            this.setState({ showRouteSwitch: !this.state.showRouteSwitch });
        }
        else {
            //Turn off heatmap

            localStorage.setItem('shareRoute', false);
            this.setState({ showRouteSwitch: !this.state.showRouteSwitch });
        }
    }

    handleChange = name => event => {
        //handle change of interval select
        if(name === 'interval'){
            window.locationSharing.checkInteval = event.target.value
            localStorage.secureCheckInterval=event.target.value
        }
        this.setState({ [name]: event.target.value });
    };

    render(){
        const { classes,theme } = this.props;
        return(
            <Router history={history}>
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
                                Settings
                        </Typography>
                        </Toolbar>
                        
                    </AppBar>
                    <div className={classes.content}>
                        <MenuItem className={classes.menuItem} variant="h6">
                            Always Show Heat Map
                            <Switch
                                checked={this.state.heatMapSwitch}
                                onChange={this.handleHeatMapSwitch.bind(this)}
                                value="checkedB"
                                color="secondary"
                                className={classes.switchButton}
                            />
                        </MenuItem>

                        <MenuItem className={classes.menuItem} variant="h6">
                            Always Share Routes
                            <Switch
                                checked={this.state.showRouteSwitch}
                                onChange={this.handleShowRouteSwitch.bind(this)}
                                value="checkedB"
                                color="secondary"
                                className={classes.switchButton}
                            />
                        </MenuItem>
                        <MenuItem className={classes.menuItem} variant="h6">
                            Security Check Interval
                            <Select
                                value={this.state.interval}
                                onChange={this.handleChange('interval')}
                                name="interval"
                                inputProps={{
                                    id: 'interval',
                                }}
                                className={classes.selectAge}
                            >
                                <MenuItem value={60000}>1 min</MenuItem>
                                <MenuItem value={600000}>10 min</MenuItem>
                                <MenuItem value={1200000}>20 min</MenuItem>
                                <MenuItem value={1800000}>30 min</MenuItem>
                            </Select>
                        </MenuItem>

                    </div>
                    
                </div>
            </Paper>
            <Route exact path="/app" component={<App history={history} heatMapState={this.state.heatMapState} />} />
            </Router>
            
        );
    }
}

SettingsPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(SettingsPage);