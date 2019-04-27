import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIs from './apis.js';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: {
        position:"fixed",
        zIndex:1200,
        height: "20%",
    },
    toolbar: {
        justifyContent: "center",
        marginTop: "20px",
    },
    foot: {
        position: "fixed",
        zIndex: 1200,
        minHeight:"150px",
        height: "10%",
        bottom:0,
    },
    footBar: {
        display: 'flex',
        justifyContents:"space-between"
    }

});
class NavigationPage extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {


        };

    }

    componentDidMount() {
        if (window.cordova) {
            this.props.locationSharing.start()
        }

    }




    render() {
        const { classes } = this.props;
        return (
            <div>
                <AppBar className={classes.appBar} color="primary" position="static">
                        <Toolbar className={classes.toolbar}>
                            <Typography
                                variant="h6"
                                color="inherit"
                            >
                                Navigation
                            </Typography>
                        </Toolbar>
                </AppBar>

                <AppBar className={classes.foot} color="primary" position="static">
                    <Toolbar className={classes.footBar}>
                        <Button variant='extended' onClick={this.handleCancelNav()} >Cancel</Button>
                    </Toolbar>
                    </AppBar>
            </div>




        );
    }
}

export default withStyles(styles)(NavigationPage);