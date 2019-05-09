import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';

import Toolbar from '@material-ui/core/Toolbar';
import Pin from './pinSvg';



const styles = theme => ({
    topBar: {
        display: 'flex',
        justifyContent:'center',
        marginTop:"20px",
    },
    foot: {
        position: "fixed",
        zIndex: 1200,
        minHeight: "60px",
        height: "10%",
        bottom: 0,
    },
    footBar: {
        height:'100%',
    },
    buttonL: {
        minWidth:'100%',
    },

    gridItem: {
        display:'flex',
        justifyContent:"center"
    },
    pin: {
        position: 'fixed',
        left: 'calc(50%)',
        top: 'calc(50% - 24px)',
        zIndex:1200,
    }
});
class DropPin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    componentDidMount() {
        this.props.hideAppBar(true)
    }

    handleCancel() {
        this.props.history.goBack();
    }

    handleConfirm() {
        
    }


  

   

    render() {

        const { classes } = this.props;
        return (
            
            <div>
                <AppBar className={classes.top} color="secondary">
                    
                    <Toolbar className={classes.topBar}>
                        <Grid container
                            justify="space-between"
                            alignItems="center"
                            direction="column"
                            >

                            <Grid xs={12} item>
                                <Typography variant="h6" color='primary'>
                                    Please confirm the pin location
                            </Typography>
                            </Grid>
                            <Grid xs={12} item>
                                <Typography variant="body2" color='primary'>
                                    Drag the map to re-locate the pin
                            </Typography>
                            </Grid>
                        </Grid>
                        
                    </Toolbar>
                </AppBar>
                <Pin className={classes.pin} color='secondary'/>
                <AppBar className={classes.foot} color="primary" position="static">
                    <Toolbar className={classes.footBar}>
                        <Grid container
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                            spacing={8}>
                            <Grid item xs={4} className={classes.gridItem} >
                                <Fab variant='extended' size='small' className={classes.button}  onClick={this.handleCancel.bind(this)} color="secondary" > Cancel </Fab>
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={4} className={classes.gridItem}>
                                <Fab variant='extended' size='small' className={classes.button}  onClick={this.handleConfirm.bind(this)} color="secondary" >Confirm</Fab>
                            </Grid>

                        </Grid>


                    </Toolbar>
                </AppBar>
            </div>



        );
    }
}

export default withStyles(styles)(DropPin);