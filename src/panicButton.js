import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import APIs from './apis.js';




const styles = theme => ({
    panic: {
        posotion: 'flex',
        zIndex: 1300,
        width: 80,
        height: 80,
        
    },
    progress: {
        position:"fixed",
        zIndex: 1300,
        
    },
    siren: {
        width: 60,
    }
});
class PanicButton extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs()
        this.start = 0;
        this.end = 0;
        this.state = {
            showProgress:false,
            completed: 0,
            progressCoord: [0, 0],
            disabled: localStorage.localContactList ? (JSON.parse(localStorage.localContactList).length === 0 ? true:false) : false,
        };

    }

    progress = () => {
        const { completed } = this.state;
        this.setState({ completed: completed >= 100 ? completed : completed + 5 });
    };

    handleTouchStart = event => {
        var position = event.currentTarget.getBoundingClientRect()

        this.start = Date.now() / 1000;
        this.setState({ completed: 0, progressCoord: [position.left, position.top], showProgress: true });
        this.timer = setInterval(this.progress, 100);
    }

    handleTouchEnd() {
        clearInterval(this.timer);
        this.setState({
            completed: 0,
            showProgress: false
        });

        if ((Date.now() / 1000 - this.start) > 2) {
            console.log('Emergency triggerd')

                console.log("On cordova emergency")
                var contList = JSON.parse(localStorage.localContactList);
                var location = this.props.getLocation();
                var lat = location.lat;
                var lng = location.lng;

                var data = [location.lat,location.lng] 

                    var api = 'api/UserEmergency/emergency/';
                    this.apis.callApi(api,data,()=>{console.log('[INFO] emergency api success')},(err)=>{console.log('[INFO] emergency api error: '+err)})

                for (var i in contList) {
                    console.log('send Message to ',contList[i].ECname)
                    var name = contList[i].ECname;
                    var userName
                    if(localStorage.UserProfiles){
                        var profile = JSON.parse(localStorage.UserProfiles)
                        userName = profile.FirstName + profile.LastName?' '+profile.LastName:'';
                    }
                    else{
                        userName='';
                    }
                    
                    var googleLink = 'https://www.google.com/maps/search/?api=1&query='+lat+','+lng
                    var string = "Hi " + name + ", \nYour friend " + userName + " is in trouble at the moment.\nThis is their last current location " + googleLink + ".\nYou might want to call them to make sure they are alright..\nThanks. \n(Sent automatically by GoSafe) ";

                    

                    
                    var options = {
                        replaceLineBreaks: false, // true to replace \n by a new line, false by default
                        android: {
                            intent: '' // send SMS without opening any other app
                        }
                    };
                
                    var success = function () { window.handleShowNoti('Message Send Successful') };
                    var error = function (e) { window.handleShowNoti('Message Failed:' + e) };
                    if(window.cordova){
                        window.sms.send(contList[i].EmergencyContactPhone, string, options, success, error);
                    }
            }
            alert('Panic Button triggerd! Emergency messages and your location have been sent to your Emergency contacts!')



        }
    }

    render() {
        
        const { classes } = this.props;
        return (
            <Fab color='primary' onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)} aria-label="panic" className={classes.panic} disabled = {this.state.disabled}>
                {this.state.showProgress ?
                    <CircularProgress
                        style={{ left: this.state.progressCoord[0], top: this.state.progressCoord[1] }}
                        className={classes.progress}
                        variant="static"
                        value={this.state.completed}
                        color="secondary"
                        size={80}
                    />
                    : null}
                {this.state.disabled ?
                    <Typography variant="subtitle2">
                        No Emergency Contacts
                    </Typography>
                    :
                    <img className={classes.siren} src='img/siren.png'></img>}
                
            </Fab>

        );
    }
}

export default withStyles(styles)(PanicButton);