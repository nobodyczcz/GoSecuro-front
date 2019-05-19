import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import APIs from './apis.js';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';


import { createBrowserHistory, createHashHistory } from 'history';
import { Router, Route, Link } from "react-router-dom";
import { ValidatorForm, SelectValidator, TextValidator } from 'react-material-ui-form-validator';
import { Toolbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    backButton:{
        color: '#FFFFFF',
        zIndex: 1210,
    },
    buttons: {
        position: "fixed",
        bottom: 0,
        width:"90%",
        padding: "5%",
        display:"flex",
        alignItems: "center",
        justifyContent: "space-between"
    },
    button: {
        minWidth: "100px",
    },
    content: {
        padding: "5%",
        overflowY: "scroll",
    },
    formControl: {
        //margin: theme.spacing.unit * 3,
        padding: '2px',
        paddingLeft: '21px',
    },
    selectFormControl: {
        margin: theme.spacing.unit,
        minWidth: 180,
        paddingLeft: '10px',
    },
    group: {
        margin: `${theme.spacing.unit}px 0`,
        flexDirection : 'row'
    },
    paper: {
        position:'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        width: "100%",
        height:"100%",
    },
    toolbar: {
        //justifyContent: "center",
        marginTop:"20px",
        
    },
    rightFloat:{
        float: 'right',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
        height: '100px',
        boxSizing: 'border-box'
                
    },
    detailsTextfield: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '100%',
        boxSizing: 'border-box'
                
    },
    headingText: {
        fontWeight:'bold',
    },
    headerTitle:{
        marginLeft: `calc( 100% - 80% )`,        
    },
    
    

});

class PinSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            errors: [],
            lightCondition: 0,
            experienceType : 0,
            experience: '',
            isExistingCamera: 0,
            otherDetails: '',
            errors: []   

        };
    }

    

    handleSubmit = () => {
        var pinLocation = this.props.getPinLocation();
        console.log("getPinLocation:" + pinLocation)
        var pin = {
            Time: new Date(),
            CoordLat: pinLocation.location.lat,
            CoordLog: pinLocation.location.lng,
            ExperienceType: this.experienceType,
            OtherDetails: '',
            Street: pinLocation.street,
            SuburbSuburbName: pinLocation.suburb,
            State: pinLocation.state,
            CCTV: this.isExistingCamera,
            StreetLight: this.lightCondition,
            OtherDetails: this.otherDetails
        }
        var apiRoute = 'api/Pin/Create';
            this.apis.callApi(apiRoute,pin,this.pinSuccess.bind(this),this.pinError.bind(this))
            

    }

    handleChange = name => event => {
        //console.log("name:" + name + "event value:" + event.target.value)
        this.setState({ [name]: event.target.value });
    };

    pinSuccess = () =>{
        console.log("Pin added to database.");
        this.props.history.push('/')
    }

    pinError(jqXHR) {
        this.setState({ errors : []});
        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) this.state.errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) this.state.errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) this.state.errors.push(response.error);
            if (response.error_description) this.state.errors.push(response.error_description);
        }
        console.log(this.state.errors)

    }
   

    render() {
        const { classes,theme } = this.props;

        return(
            <Paper className={classes.paper}>
                <AppBar color="secondary" position="static">
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.backButton} onClick={()=>{this.props.history.goBack()}}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.headerTitle}
                            >
                            Drop a Pin
                        </Typography>
                    </Toolbar>
                </AppBar>

                <ValidatorForm
                    ref="theForm"
                    id="theForm"
                    onSubmit={this.handleSubmit}
                    onError={errors => console.log(errors)}

                    >
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                        spacing={8}
                        className={classes.content}
                    >

                        <Grid item xs={12} md={6}>
                            <Typography color="secondary" gutterBottom align='left' variant='h6'>
                                Tell us more about the location:
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant='h7'>
                                1. Lighting condition
                            </Typography>
                            <FormControl required className={classes.selectFormControl}>
                                <Select
                                    native
                                    value={this.state.lightCondition}
                                    onChange={this.handleChange('lightCondition')}
                                    name="lightCondition"
                                    inputProps={{
                                    id: 'exp-native-required',
                                    }}
                                >
                                    <option value={0}>Not sure</option>
                                    <option value={1}>No street light</option>
                                    <option value={2}>Low light</option>
                                    <option value={3}>Normal light</option>
                                    <option value={4}>Brightly lit</option>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                        <Typography variant='h7'>
                                2. Surveillance Cameras (CCTV)
                            </Typography>
                            <FormControl required className={classes.selectFormControl}>
                                <Select
                                    native
                                    value={this.state.isExistingCamera}
                                    onChange={this.handleChange('isExistingCamera')}
                                    name="isExistingCamera"
                                    inputProps={{
                                    id: 'exp-native-required',
                                    }}
                                >
                                    <option value={0}>Not sure</option>
                                    <option value={1}>No cameras</option>
                                    <option value={2}>Existing Cameras</option>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                        <Typography  variant='h7'>
                                3. Experience
                            </Typography>
                            <FormControl required className={classes.selectFormControl}>
                                <Select
                                    native
                                    value={this.state.experienceType}
                                    onChange={this.handleChange('experienceType')}
                                    name="experienceType"
                                    inputProps={{
                                    id: 'exp-native-required',
                                    }}
                                >
                                    <option value={0}>None</option>
                                    <option value={1}>Robbed</option>
                                    <option value={2}>Stalk</option>
                                    <option value={3}>Cat-call</option>
                                    <option value={4}>Harassment</option>
                                    <option value={5}>Assault</option>
                                    <option value={6}>Other</option>
                                </Select>
                            </FormControl>
                            {this.state.experienceType == 6 ? 
                                <TextField
                                    id="standard-textarea-flexible"
                                    label= "Other details"
                                    placeholder="Type of Experience"
                                    multiline={false}
                                    rowsMax="1"
                                    type='string'
                                    variant="outlined"
                                    value={this.state.otherDetails}
                                    onChange={this.handleChange('otherDetails')}
                                    className={classes.detailsTextfield}
                                    margin="normal"
                                />
                                
                                :
                                null
                                }
                        </Grid>                       

                        <Grid item xs={12} md={6}>
                            <Typography variant='h7'>
                                4. Your Experience (Limit: 1000 words)
                            </Typography>
                            <TextField
                                id="standard-textarea-flexible"
                                placeholder="You can describe your experience here..."
                                multiline={true}
                                rows="4"
                                rowsMax="8"
                                type='string'
                                variant="outlined"
                                value={this.state.experience}
                                onChange={this.handleChange('experience')}
                                className={classes.textField}
                                margin="normal"
                                />
                        </Grid>
                    </Grid>

                    <span className={classes.buttons}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            onClick={() => { this.props.history.goBack()}}
                        >
                            Back
                        </Button>
                        <Button
                            style={{ float: "right" }}
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            type="submit"
                            form= "theForm"
                        >
                            Submit
                        </Button>
                    </span>
                    
                </ValidatorForm>
            </Paper>
        );

    }
}

PinSurvey.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(PinSurvey);