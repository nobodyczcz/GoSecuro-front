import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import APIs from './apis.js';
import PanicButton from './panicButton.js';
import Grid from '@material-ui/core/Grid';
import geolib from 'geolib';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import Fab from '@material-ui/core/Fab';
import { Divider } from '@material-ui/core';



import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: {
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: 1100,
        width: '100%',
        zIndex:1200,
        minHeight: '120px',
        backgroundColor:'#4f6c98',
    },
    toolbar: {
        justifyContent: "center",
        marginTop: "20px",
    },
    foot: {
        position: "fixed",
        zIndex: 1200,
        minHeight:"60px",
        height: "10%",
        bottom:0,
    },
    footBar: {
        display: 'flex',
        justifyContents: "space-between",
        alignItems:"flex-end"
    },
    panicButton: {
        zIndex: 1300,

        position: 'fixed',
        top: 'calc( 100% - 160px)',
        left: 'calc( 50% - 40px)',
    },
    grid: {
        padding:"15px",
    },
    myPositionIcon: {
        position: 'absolute',
        left: 'calc(100% - 60px)',
        top: 'calc(100% - 120px)',
        display: 'flex',
        zIndex: 1100,
    },
    header: {
        width: "100%",
        minHeight: "20px",
        backgroundColor:"#ff7504",
    },
    transit: {
        display: 'flex',
        justifyContent: "space-between",
        padding:"5px"
    },
    contentCard: {
        backgroundColor: "#ff7504",
        width: "100%",
        height: "100%",
        padding:"5px"
    },
    gridItem: {
    },



});
class NavigationPage extends React.Component {
    constructor(props) {
        super(props);


        this.close = false;
        this.veryClose = false;
        this.apis = new APIs();
        var routes = this.props.currentRoute.routes[0].legs[0]
        this.steps = [];
        for (var i = 0; i < routes.steps.length; i++) {
            if (routes.steps[i].steps) {
                for (var x = 0; x < routes.steps[i].steps.length; x++) {
                    routes.steps[i].steps[x].father = routes.steps[i]
                    this.steps.push(routes.steps[i].steps[x])
                }
            }
            else {
                this.steps.push(routes.steps[i])
            }
        }
        console.log(this.steps)
        this.state = {
            startTime: new Date(),
            planEndTime: new Date(routes.duration.value * 1000),
            steps: this.steps,
            current: 0,
            next: 1,
            toNext: this.steps[0].distance.value,
            finish:false,
            stepStart: {
                lat: this.steps[0].start_location.lat(),
                lng: this.steps[0].start_location.lng()
            },
            stepEnd: {
                lat: this.steps[0].end_location.lat(),
                lng: this.steps[0].end_location.lng()
            },
            tracking: false,
        };

    }

    componentDidMount() {
    }
    componentWillMount() {
        this.props.hideAppBar(true)


    }
    componentWillUnmount() {
    }

    handleStartTracking() {
        
        

    }

    handleStopTracking() {

        if (window.cordova) {
            console.log("Stop tracking. stop location:" + JSON.stringify(this.props.userLocation));

            this.props.locationSharing.stopTracking();

        }
        else { console.log("tracking do not work in broswer emviroment") }

    }


    handleCancelNav() {
        if (!this.props.alreadyTracking) {
            this.handleStopTracking()
        }
        this.props.history.goBack();

        
    }

    updateLocation(coord) {
        if (this.state.finish) {
            return
        }
        var distance = geolib.getDistance(
            { latitude: coord.lat, longitude: coord.lng },
            { latitude: this.state.stepEnd.lat, longitude: this.state.stepEnd.lng }
        );

        if (distance <= 10) {
            this.close = true
        }
        var theCurrent = this.state.current;
        var theNext = this.state.next;
        var theFinish = this.state.finish;
        var theStart = this.state.stepStart;
        var theEnd = this.state.stepEnd;
        if ((this.close && distance > 15) || distance < 5) {
            this.close = false;
            theNext = theNext + 1;
            theCurrent = theCurrent + 1;

            theStart= {
                lat: this.steps[theCurrent].start_location.lat(),
                lng: this.steps[theCurrent].start_location.lng()
            }

            theEnd = {
                lat: this.steps[theCurrent].end_location.lat(),
                lng: this.steps[theCurrent].end_location.lng()
            }


            if (theCurrent >= this.state.steps.length) {
                theFinish = true;
            }
        }
        console.log("update: " + distance + " " + "theCurrent");

        this.setState({
            toNext: distance,
            next: theNext,
            current: theCurrent,
            finish: theFinish,
            stepStart: theStart,
            stepEnd:theEnd,
        })

    }




    render() {
        const { classes } = this.props;
        var currentStep = this.state.steps[this.state.current];
        var nextStep = this.state.steps[this.state.next];
        var toNext;
        if (this.state.toNextStep > 1000) {
            toNext = this.state.toNext / 1000 + " km"
        }
        else {
            toNext = this.state.toNext + ' m'
        }
        
        return (
            <div>
                <Paper className={classes.appBar} position="static">

                    

                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        spacing={8}
                        className={classes.grid}
                    >
                        
                        {currentStep.father ?
                            <Grid item xs={12}>
                                <Card className={classes.header}>
                                    <Typography
                                        variant="body1"
                                        align="center"
                                        color="primary"
                                    >
                                        <a dangerouslySetInnerHTML={{ __html: currentStep.father.instructions }} />
                                    </Typography>
                                </Card>
                            </Grid>
                            : null
                                    }
        
                                
                                
                                
                        {currentStep.travel_mode == "TRANSIT" ? 
                            <Grid item xs={12}>
                                <Grid container
                                    justify="space-between"
                                    alignItems="stretch"
                                    direction="row"
                                    spacing={8}>
                                    <Grid item xs={5} className={classes.transit}>
                                        <Card className={classes.contentCard}>>
                                        <Typography
                                                variant="h5"
                                                color="primary"
                                        
                                        >
                                            Take {currentStep.transit.line.vehicle.name} {currentStep.transit.line.short_name} 
                                        </Typography>
                                        <Typography
                                                variant="h5"
                                                color="primary"

                                        >
                                            Heading  {currentStep.transit.headsign}
                                            </Typography>
                                            </Card>
                                    </Grid>

                                    <Grid item xs={7} className={classes.gridItem}>
                                        <Card className={classes.contentCard} >
                                        <Typography
                                                variant="body1"
                                                color="primary"
                                        >
                                            Departure stop {currentStep.transit.departure_stop.name}. Arrival stop {currentStep.transit.departure_stop.name}.
                                        </Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                            </Grid>
                            :
                            <Grid item xs={12}>
                                <Grid container
                                    justify="space-between"
                                    alignItems="stretch"
                                    direction="row"
                                    spacing={8}>
                                <Grid item xs={5} className={classes.transit}>
                                    <Card className={classes.contentCard}>
                                        <Typography
                                                variant="h5"
                                                color="primary"
                                        >
                                            After {toNext}
                                        </Typography>
                                        <Typography
                                                variant="h5"
                                                color="primary"
                                        >
                                                {nextStep ? nextStep.maneuver.toUpperCase():null}
                                        </Typography>
                                    </Card>
                                </Grid>
                                

                                
                                    <Grid item xs={7} className={classes.gridItem} >
                                    <Card className={classes.contentCard}>
                                        <Typography
                                                variant="h6"
                                                color="primary"
                                        >
                                                {nextStep ? <a dangerouslySetInnerHTML={{ __html: nextStep.instructions }} /> : "You will reach the destination"}
                                            </Typography>
                                    </Card>
                                </Grid>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                    
                </Paper>

                <Fab onClick={this.props.handleMyLocationClick} color="primary" size="small" className={classes.myPositionIcon}>
                    <MyLocationIcon />
                </Fab>

                <AppBar className={classes.foot} color="primary" position="static">
                    <div className={classes.panicButton}>
                        <PanicButton getLocation={this.props.getLocation} />
                    </div>
                    <Toolbar className={classes.footBar}>
                        <Grid container
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                            spacing={8}>
                            <Grid item xs={4}>
                                <Fab variant='extended' onClick={this.handleCancelNav.bind(this)} color="secondary" >Cancel</Fab>
                            </Grid>
                            <Grid item xs={8}>
                                <a>Navigation route and locations are sharing now</a>
                            </Grid>

                        </Grid>
                        
                        
                    </Toolbar>
                    </AppBar>
            </div>




        );
    }
}

export default withStyles(styles)(NavigationPage);