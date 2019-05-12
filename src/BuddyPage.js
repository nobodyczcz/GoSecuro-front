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


function getModalStyle() {
  
    return {
      top: `calc(100% - 60% )`,
      left: `calc(100% - 98% )`,
      width: `calc(100% - 10% )`,
    };
  }

function EditIcon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="1.5em" 
            height="1.5em" 
            viewBox="0 0 24 24"
            {...props}
        >
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
    );
}

const styles = theme => ({
    addNewButton:{
        left:`calc( 100% - 125px )`
    },
    avatar: {
        marginTop: '0px',
        width: "60px",
        height:"60px",
        fontSize: "20px"
    },
    customLeftButton:{
        left:`calc( 100% - 90% )`,
        minWidth: '70px',
        height: '40px',
        width: '100px'
    },

    customRightButton:{
        left:`calc( 50% - 10% )`,
        minWidth: '70px',
        height: '40px',
        width: '100px'
    },

    deleteIconButton:{
        float: 'right',
        top: `calc( 100% - 90% )`,
        padding: '0'

    },
    editIconButton:{
        float: 'right',
        top: `calc( 100% - 90% )`,
        transition: 'opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        opacity: '1',
        fill: '#4f6c98',
        paddingLeft: '20px'

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
    contMobile: {
        width: '50%',
        float: 'right',
        fontSize:'medium',
        fontColor: '#bdbdbd'
    },
    textField: {
        marginTop: 0,
        marginRight:'1%',
        width:'49%'
    },
    mainText: {
        fontWeight:'bold',
        justifyContent: 'center',
    },
    modalPaper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '10px',
        outline: 'none',
      },
      contactPaper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: `calc( 100% - 54% )`,
        left: '0',
        zIndex: 900,
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
            userName:'',
            open:false,
            contactList:[],
            loading: true,
            errors: [],
            isOpen:false,
        };

    }

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    handleEditOpen = (index,item) => {
        this.setState({ isOpen: true,
                        name:item.name,
                        mobile:item.mobile,
        });
    };

    handleEditClose = () => {
        this.setState({ isOpen: false,
            name:'',
            mobile: '',
});
    };

    componentDidMount() {
        this.retrieveBuddies();

    }

    
    retrieveBuddies() {
        this.setState({ loading: true });

        console.log(window.serverUrl);
        console.log("Retrieving emergency contacts");
        var apiRoute = 'api/UserEmergency/retrieveUser';
        if (this.props.isLogin)
            this.apis.callApi(apiRoute,'',this.retrieveSuccess.bind(this),this.regError.bind(this));
        
    }

    retrieveSuccess(reply) {
        console.log("Success")
        if (this.props.isLogin) {
            this.setState({ contactList: JSON.parse(JSON.parse(reply).data) });
            //localStorage.setItem("localContactList", JSON.stringify(this.state.contactList));
        }

        this.setState({ loading: false });            
        //jump to next page
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
        console.log('rendering guardian page')
        return (
            <Paper className={classes.paper}>
                <div className={classes.content}>
                    
                    <Typography id='headerText' className={classes.mainText} color="secondary" gutterBottom align='left' variant='h5'>
                        Buddies
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
                     
                            {this.state.contactList.map(function (item, i) {
                                var displayName = "";
                                displayName = (item.ECname ? item.ECname[0] : "") + (item.ECname ? item.ECname[1] : "");
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
                                                    {item.ECname}<br/>
                                                    {item.EmergencyContactPhone}
                                                </Typography>
    
                                                {/* <Typography className={classes.contMobile} gutterBottom align='left' variant="subtitle2">
                                                    {item.EmergencyContactPhone}
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