import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';

import { withStyles } from '@material-ui/core/styles';




const styles = theme => ({
    panic: {
        posotion: 'flex',
        zIndex: 1300,
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
                    var string = "Hi " + name + ", \nYour friend " + localStorage.userName + " is in trouble at the moment.\nThis is their last current location " + googleLink + ".\nYou might want to get in touch with them to make sure they are alright..\nThanks. \n(Sent automatically by GoSafe) ";
                    var data = [contList[i].mobile, string] 
                    var jsonData = JSON.stringify(data)
                    fetch('https://gosafe-back20190407071339.azurewebsites.net/Suburbs/Message/', {
                        method: 'POST',
                        body: jsonData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json())
                        .then(response => {
                            console.log(response);

                        })
                        .catch(error => {
                            console.log('error')
                            console.error('Error:', error)
                        });
            }
            alert('Emergency trigerd! Emergency message and your location sened!')



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