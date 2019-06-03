import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import APIs from './apis.js';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import InfoIcon from '@material-ui/icons/Info';
import { Fade } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Toolbar } from '@material-ui/core';
import { createBrowserHistory, createHashHistory } from 'history';

import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    avatar: {
        // marginTop: '0px',
        // width: "60px",
        // height:"60px",
        fontSize: "20px"
    },
    backButton:{
        color: '#FFFFFF',
        position:'fixed',
        left:'0',
    },

    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex:1200,
    },
    content: {
        marginTop:'75px',
        padding: '3%',
        justifyContent: 'center',
    },
    contacts: {
        height:"45%",
        overflowY: "scroll",
        paddingLeft: '3%',
        paddingRight: '3%',
    },
    contCard: {
        width: '100%',
        height: theme.spacing.unit * 8,
        display: "flex",
        //marginBottom:theme.spacing.unit * 2,
    },
    cardContent:{
        padding: '5px'
    },
    contName: {
        //width: '50%',
        float: 'right',
        marginLeft: '30px',
        fontSize:'medium'
    },
    infoText: {
        color: '#757575',
        fontSize: 'smaller'
    },
    mainText: {
        fontWeight:'bold',
        justifyContent: 'center',
    },
    progress: {
        marginLeft: theme.spacing.unit * 20,
        padding: '5px'
    },
    infoIcon:{
        //float: "right",
        marginTop: "0px",
        left: 'calc(100% - 10%)'
    },
    notification:{
        width: "90%",
        justifyContent: "center",
        top: theme.spacing.unit * 30,
        left: 'calc( 100% - 95%)',
        opacity: 0.9,
    },
    toolbar: {
        marginTop:"20px",
        display:'flex',
        justifyContent:"center"
    },
});
class BuddyPage extends React.Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            name: '',
            mobile: '',
            contactList:[],
            loading: true,
            errors: [],
            noContacts: false,
            showInfo: false
            
        };

    }

    componentWillMount(){
        this.retrieveBuddies();
        this.props.hideAppBar(true);

    }
    
    /* Handle click on Info icon
    * Sets  state true to display information snackbar about emergency contact
    *
    * start 
    */
   handleInfoClick(){
    this.setState({ showInfo: true });

}
/* Handle click on Info icon
*
* finish 
*/

/* Handle close of Info icon
* Sets  state false to display information snackbar about emergency contact
*
* start 
*/
handleInfoClose = (event, reason) => {
    if (reason === 'clickaway') {
        return;
      }
    this.setState({ showInfo: false });

}
/* Handle close of Info icon
*
* finish 
*/

    retrieveBuddies() {
        this.setState({ loading: true });
        console.log(window.serverUrl);
        console.log("Retrieving buddies");
        var apiRoute = 'api/UserEmergency/retrieveUser';
        if (this.props.isLogin)
            this.apis.callApi(apiRoute,'',this.retrieveSuccess.bind(this),this.regError.bind(this));
        
    }

    retrieveSuccess(reply) {
        console.log("Buddies retrieved successfully.")
        if (this.props.isLogin) {
            this.setState({ contactList: JSON.parse(reply.data) });
        }
        console.log("buddies length: " + JSON.parse(reply.data).length)
        if(JSON.parse(reply.data).length == 0){
            this.setState({noContacts : true});
        }
        else{
             this.setState({noContacts: false})
        }
         
        this.setState({ loading: false });          
    }

    regError(jqXHR) {
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
        const { classes, theme } = this.props;
        console.log('rendering Buddies page')
        return (
            <Paper className={classes.paper}>
                <AppBar
                    position="fixed"
                    color="secondary"
                    className={classes.appBar}
                >
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.backButton} onClick={()=>{                
                            this.props.history.goBack();
                        }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.headerTitle}
                            >
                                Buddies
                        </Typography>
                    </Toolbar>
                    
                </AppBar>
                <div className={classes.content}>
                    <IconButton onClick={this.handleInfoClick.bind(this)} color="secondary" size="small" className={classes.infoIcon}>
                        <InfoIcon />
                    </IconButton>
                    
                    <Snackbar
                        anchorOrigin={{ vertical : 'top', horizontal: 'center' }}
                        open={this.state.showInfo}
                        //autoHideDuration={4000}
                        TransitionComponent={Fade}
                        onClose={this.handleInfoClose}
                        className={classes.notification}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        action={[
                            <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.handleInfoClose}
                            >
                            <CloseIcon />
                            </IconButton>,
                        ]}
                        message={
                            <span id="message-id">
                                Your buddies add you as emergency contact. Do reach out to them when they need you!
                            </span>
                        }
                        
                    />
                    {/* <Typography className={classes.infoText}>
                        Your buddies add you as emergency contact. Do reach out to them when they need you!
                    </Typography> */}
                </div>

                <div className={classes.contacts}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                        
                            {this.state.loading ? <CircularProgress size={30} color="secondary" className={classes.progress} />:null}
                            {this.state.noContacts ? 
                                <Typography variant="h6">
                                    Waiting for buddies to add you!
                                </Typography>
                                :
                                null
                            }
                            {this.state.contactList.map(function (item, i) {
                                var displayName = "";
                                var phone = item.phone;
                                var details = item.userDetails;
                                var fullName = (details.FirstName ? details.FirstName : "") +' '+ (details.LastName ? details.LastName : "")
                                var displayName = "";
                                if (fullName.length <= 5) {
                                    displayName = fullName;
                                }
                                else if (details.FirstName && details.FirstName.length <= 5) {
                                    displayName = details.FirstName;
                                }
                                else {
                                    displayName = (details.FirstName ? details.FirstName[0] : "") + (details.LastName ? details.LastName[0] : "");
                                }

                                if (displayName == "") {
                                    displayName = "None"
                                }                               
                                return (
                                    <Grid key={i} item xs={12} md={6} lg={3}>
                                        <Card className={classes.contCard} >
                                            <CardContent className={classes.cardContent} >
                                            <Fab className={classes.avatar} color="secondary" >
                                             { displayName }
                                             </Fab>
                                            <Typography className={classes.contName} gutterBottom align='left' variant="h6">
                                                    {fullName?fullName : 'No Name'}<br/>
                                                    {phone}
                                            </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                            );
                            }.bind(this))}
                        </Grid>
                    </div>              
            </Paper>

        );
    }
}

BuddyPage.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  };
export default withStyles(styles, { withTheme: true })(BuddyPage);
