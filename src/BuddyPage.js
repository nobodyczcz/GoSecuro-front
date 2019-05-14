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

import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    avatar: {
        marginTop: '0px',
        width: "60px",
        height:"60px",
        fontSize: "20px"
    },
    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex: 899,
        marginTop: '130px'
    },
    content: {
        marginTop: "0",
        padding: '3%',
    },
    contacts: {
        height:"45%",
        overflowY: "scroll",
        paddingLeft: '3%',
        paddingRight: '3%',
    },
    contCard: {
        width: '100%',
        height:"63px",
        marginBottom:theme.spacing.unit * 2,
    },
    cardContent:{
        padding: '0px'
    },
    contName: {
        width: '50%',
        float: 'right',
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
            noContacts: false
            
        };

    }

    componentDidMount() {
        this.retrieveBuddies();

    }

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
        const { classes } = this.props;
        console.log('rendering Buddies page')
        return (
            <Paper className={classes.paper}>
                <div className={classes.content}>
                    <Typography id='headerText' className={classes.mainText} color="secondary" gutterBottom align='left' variant='h5'>
                        Buddies
                    </Typography >
                    <Typography className={classes.infoText}>
                        Your buddies add you as emergency contact. Do reach out to them when they need you!
                    </Typography>
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
     */}
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
  };
export default withStyles(styles)(BuddyPage);