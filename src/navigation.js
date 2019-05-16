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

import Switch from '@material-ui/core/Switch';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    appBar: {
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: 1100,
        width: '100%',
        minHeight: '120px',
        backgroundColor:'#4f6c98',
    },
    toolbar: {
        justifyContent: "center",
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
        marginTop: "20px",

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
    },
    headerCard: {
        width: "100%",
        backgroundColor:"#ff7504",
    },
    transit: {
        display: 'flex',
        justifyContent: "space-between",
        padding:"5px",
    },
    contentCard: {
        backgroundColor: "#ff7504",
        width: "96%",
        height: "96%",
        padding:"2%"
    },
    gridItem: {
    },
    shareSwitch:{
        display:'flex',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    board:{
        width:'100%',
        marginTop:'5px',

    },
    exitFab:{
        width:'100%'
    }



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
        this.cloest = this.steps[0].distance.value;//the closest distance to next step
        this.fastest = 0;//the fartest distance to previous step
        console.log(this.steps)
        this.state = {
            startTime: Date.now(),
            planEndTime: Date.now(routes.duration.value * 1000),
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
            navWithShare:false,
            instructions:this.steps[0].instructions,

        };

    }

    handleChange = name => event => {
        if(event.target.checked){
            if(window.cordova){
                this.interval = setTimeout(function() {
                    if (this.state.navWithShare) {
                        console.log("[INFO]3 seconds reach, switch still on. start sharing.")
                        this.props.locationSharing.navigationRoute = JSON.stringify({
                            overview_path: this.props.currentRoute.routes[0].overview_path,
                            origin: this.props.currentRoute.request.origin.location,
                            destination: this.props.currentRoute.request.destination.location,
                            duration: this.props.currentRoute.routes[0].legs[0].duration.value,
                        });
                        this.props.locationSharing.startTracking(this.props.getLocation(),this.state.planEndTime);
                    }
                    else {
                        console.log("[INFO]3 seconds reach, switch OFF.")
                    }
                }.bind(this), 3000);
                
            }
        }
        else{
            this.handleStopTracking()
        }
        this.setState({ [name]: event.target.checked });
    };

    componentDidMount() {
        console.log(this.state.planEndTime);
    }
    componentWillMount() {
        this.props.hideAppBar(true)
        if(window.cordova){
            this.state.navWithShare = this.props.locationSharing.isTracking();
        }


    }


    handleStopTracking() {

        if (window.cordova) {
            console.log("Stop tracking. stop location:" + JSON.stringify(this.props.userLocation));

            this.props.locationSharing.stopTracking();

        }
        else { console.log("tracking do not work in broswer emviroment") }

    }


    handleCancelNav() {
        this.handleStopTracking()
        
        this.props.history.goBack();

        
    }
    handleExit(){
        this.props.history.push('/map');
    }

    updateLocation(coord) {
        if (this.state.finish) {
            return
        }
        var distance = geolib.getDistance(
            { latitude: coord.lat, longitude: coord.lng },
            { latitude: this.state.stepEnd.lat, longitude: this.state.stepEnd.lng }
        );

        var distanceToStart = geolib.getDistance(
            { latitude: coord.lat, longitude: coord.lng },
            { latitude: this.state.stepStart.lat, longitude: this.state.stepStart.lng }
        );

        if(this.cloest){
            if (distance<this.cloest){
                this.cloest = distance;
            }
        }
        else{
            this.cloest = distance;
        }

        if(this.fastest){
            if (distanceToStart > this.fastest){
                this.fastest = distanceToStart;
            }
            else if(this.fastest-distanceToStart > 10){
                this.cloest = distance;
            }
        }
        else{
            this.fastest = distanceToStart;
        }



        var theCurrent = this.state.current;
        var theNext = this.state.next;
        var theFinish = this.state.finish;
        var theStart = this.state.stepStart;
        var theEnd = this.state.stepEnd;

        if (!this.steps[theCurrent+1] && this.cloest<=15) {
            theFinish = true;
            this.handleStopTracking()
            this.setState({finish:theFinish});
            return
        }

        if (((distance - this.cloest > 5) && (distanceToStart-this.fastest>=-5) ) || distance < 5) {
            
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
            this.cloest=geolib.getDistance(
                { latitude: coord.lat, longitude: coord.lng },
                { latitude: theEnd.lat, longitude: theEnd.lng }
            );;
            this.fastest= geolib.getDistance(
                { latitude: coord.lat, longitude: coord.lng },
                { latitude: theStart.lat, longitude: theStart.lng }
            );;


            
        }

        var currentInstruction = this.steps[theCurrent].instructions
        var currentSecondIndex = currentInstruction.search('<div')
        var currentSecondInstruction='';
        if(currentSecondIndex>=0){
            currentSecondInstruction = currentInstruction.slice(currentSecondIndex);
            currentInstruction = currentInstruction.slice(0,currentSecondIndex);
        }

        var nextInstruction =  this.steps[theNext] ? this.steps[theNext].instructions:'';
        var nextSecondIndex = nextInstruction.search('<div')
        var nextSecondInstruction='';
        if(nextSecondIndex>=0){
            nextSecondInstruction = nextInstruction.slice(nextSecondIndex);
            nextInstruction = nextInstruction.slice(0,nextSecondIndex);
        }
        var turnDistance = this.steps[theCurrent].travel_mode === "WALKING"? 60:400
        var theInstructions = '';
        if(theCurrent===0 && this.cloest>turnDistance){
            theInstructions = currentInstruction
        }
        else if(!this.steps[theNext]){
            theInstructions = currentSecondInstruction;
        }
        else if(this.cloest <= turnDistance){
            theInstructions = nextInstruction
        }
        else{
            theInstructions = currentSecondInstruction
        }
        // console.log(`[INFO] closest ${this.cloest} farsest ${this.fastest} turn${turnDistance}+ THE ${theInstructions} CUR ${currentInstruction} CUR SE ${currentSecondInstruction} NEX ${nextInstruction} NEX SE${nextSecondInstruction}`)


        this.setState({
            toNext: distance,
            next: theNext,
            current: theCurrent,
            finish: theFinish,
            stepStart: theStart,
            stepEnd:theEnd,
            instructions: theInstructions
        })

    }




    render() {
        const { classes } = this.props;
        var currentStep = this.state.steps[this.state.current];
        var nextStep = this.state.steps[this.state.next];
        var toNext;
        if (this.state.toNext > 1000) {
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
                        direction="column"
                        justify="center"
                        alignItems="center"
                        spacing={8}
                        className={classes.grid}
                    >
                    {currentStep.father ?
                            <Grid item xs={12}  className={classes.header}>
                                <Card className={classes.headerCard}>
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
                    {this.state.finish?
                        <Grid item xs={12}>
                            <Card className={classes.contentCard}>
                                <Typography
                                    variant="h5"
                                    align="center"
                                    color="primary"
                                >
                                You are at the destination now. Navigation Finish
                                </Typography>
                            </Card>
                        </Grid>
                        :
                        <Grid item xs={12}>
                        
                        {currentStep.travel_mode == "TRANSIT" ? 
                            
                                <Grid container
                                    justify="space-between"
                                    alignItems="stretch"
                                    direction="row"
                                    spacing={8}>
                                    <Grid item xs={5} className={classes.transit}>
                                        <Card className={classes.contentCard}>>
                                        <Typography
                                                variant="h6"
                                                color="primary"
                                        
                                        >
                                            Take {currentStep.transit.line.vehicle.name} {currentStep.transit.line.short_name} 
                                        </Typography>
                                        <Typography
                                                variant="h6"
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
                                            Departure time {currentStep.transit.departure_time.text}.
                                        </Typography>
                                        <Typography
                                                variant="body1"
                                                color="primary"
                                        >
                                            Departure stop {currentStep.transit.departure_stop.name}.
                                        </Typography>
                                        <Typography
                                                variant="body1"
                                                color="primary"
                                        >
                                            Arrival time {currentStep.transit.arrival_time.text}.
                                        </Typography>
                                        <Typography
                                                variant="body1"
                                                color="primary"
                                        >
                                            Arrival stop {currentStep.transit.departure_stop.name}.
                                        </Typography>
                                            </Card>
                                        </Grid>
                                    </Grid>
                            :
                                <Grid container
                                    justify="space-between"
                                    alignItems="stretch"
                                    direction="row"
                                    spacing={8}
                                    >
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
                                        {this.state.instructions?<a dangerouslySetInnerHTML={{ __html: this.state.instructions }} />:'Continue on current road'}
                                            </Typography>
                                    </Card>
                                </Grid>
                                </Grid>
                        }
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
                    {this.state.finish?
                        <Grid container
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                            spacing={8}>
                            <Grid item xs={4}>
                                <Fab className={classes.exitFab} variant='extended' onClick={this.handleExit.bind(this)} color="secondary" >Exit</Fab>
                            </Grid>
                        </Grid>
                            :
                        <Grid container
                            justify="space-between"
                            alignItems="center"
                            direction="row"
                            spacing={8}>
                            <Grid item xs={4}>
                                <Fab variant='extended' onClick={this.handleCancelNav.bind(this)} color="secondary" >Cancel</Fab>
                            </Grid>
                            <Grid item xs={8} className={classes.shareSwitch}>
                            <Typography variant="h6">
                                Location share
                            </Typography>
                            <Switch
                                checked={this.state.navWithShare}
                                onChange={this.handleChange('navWithShare')}
                                value="navWithShare"
                            />
                            </Grid>
                        </Grid>
                        }
                        
                    </Toolbar>
                    </AppBar>
            </div>




        );
    }
}

export default withStyles(styles)(NavigationPage);