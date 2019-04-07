import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';




import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    panic: {
        position: 'absolute',
        top: '70%',
        left: 'calc( 50% - 50px)',
        zIndex: 1200,
        width: 100,
        height: 100,
        
    },
    siren: {
        width: 70,
    }
});
class PanicButton extends React.Component {
    constructor(props) {
        super(props);
        this.start = 0;
        this.end = 0;
        this.state = {

        };

    }

    handleTouchStart() {
        this.start = Date.now()/1000
    }
    handleTouchEnd() {
        if ((Date.now() / 1000 - this.start) > 2) {
            console.log('Emergency triggerd')

                console.log("On cordova emergency")
                var contList = JSON.parse(localStorage.contactList);
                var location = this.props.getLocation();
                var lat = location.lat;
                var lng = location.lng;
                for (var i in contList) {
                    console.log('send Message to ',contList[i].name)
                    var name = contList[i].name;
                    var googleLink = 'https://www.google.com/maps/search/?api=1&query='+lat+','+lng
                    var string = "Hi" + name + ", \nI'm in trouble at the moment. \nThis is my current location " + googleLink + " . I need your help. \nThanks."
                    console.log(parseInt(contList[i].mobile));
                    var data = {
                        'to': contList[i].mobile,
                        'body':string
                    }
                    console.log(data);
                    window.sendSMSRequest.to = contList[i].mobile;
                    window.sendSMSRequest.body = string;
                    console.log('set request done: ', window.sendSMSRequest);
                    console.log('auth ', window.auth.accessToken);
                    var result = function (error, data, response) {
                        if (error) {
                            console.log('failed')
                            console.error(error);
                        } else {
                            console.log('API called successfully. Returned data: ' + data);
                        }
                    };

                    window.apiInstance.sendSMS(JSON.stringify(data), result);

                }


        }
    }

    render() {
        
        const { classes } = this.props;
        return (
            <Fab color='primary' onTouchStart={this.handleTouchStart.bind(this)} onTouchEnd={this.handleTouchEnd.bind(this)} aria-label="panic" className={classes.panic}>
                <img className={classes.siren} src='img/siren.png'></img>
            </Fab>

        );
    }
}

export default withStyles(styles)(PanicButton);