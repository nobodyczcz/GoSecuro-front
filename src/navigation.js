import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import APIs from './apis.js';
import { ValidatorForm, SelectValidator, TextValidator } from 'react-material-ui-form-validator';


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