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

                var location = this.props.getLocation();

                this.apis.triggerEmergency(location);

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