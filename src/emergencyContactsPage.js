import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import APIs from './apis.js';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import { createBrowserHistory, createHashHistory } from 'history';
import { Router, Route, Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';


var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}

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
    paper: {
        position:'fixed',
        top: 0,
        left: 0,
        zIndex: 1100,
        width: "100%",
        height:"100%",
    },
    addNewButton:{
        left:`calc( 100% - 125px )`
    },
    buttons: {
        position: "fixed",
        bottom: 0,
        width:"90%",
        padding: "5%",
        justifyItems:"space-between"
    },
    button: {
        minWidth: "100px",
    },
    content: {
        marginTop: "10px",
        padding: '3%',
    },
    cont: {
        width: '100%'
    },
    contacts: {
        height:"100%",
        overflowY: "scroll",
        paddingLeft: '3%',
        paddingRight: '3%',
    },
    contactPaper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: `calc( 100% - 54% )`,
        left: '0',
        zIndex: 900,
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
        fill: '#FF7504',
        paddingLeft: '20px'

    },
    textField: {
        marginTop: 0,
        marginRight:'1%',
        width:'49%'
    },
    modalPaper: {
        position: 'absolute',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: '10px',
        outline: 'none',
    },
    toolbar: {
        justifyContent: "center",
        marginTop:"20px",
    },

});
class EmergencyContacts extends React.Component{
    constructor(props) {
        super(props);
        this.apis = new APIs();
        this.state = {
            name: '',
            mobile: '',
            userName:'',
            open:false,
            logining:true,
            isLogin:true,
            contactList:[],
            errors:[]
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
                        activeItemName: item.name,
                        activeMobile: item.mobile,
                        activeIndex:index
        });
    };

    handleEditClose = () => {
        this.setState({ isOpen: false});
    };

    componentDidMount() {
        this.retrieveEmergencies();
        
    }

    handleChange = name => event => {
        if (name == "mobile" && event.target.value.length > 10) {
            console.log("Mobile number: Max limit 10 reached")
        }
        else if(name == "name" && event.target.value.length > 10){
            console.log("Contact Name: Max limit 10 reached")
        }
        else {
            this.setState({ [name]: event.target.value });

        }


    };

    handleAddNew = () => {
        if (this.state.name.length === 0 || this.state.mobile.length === 0) {
            console.log("emergencyContactsPage: Name or Mobile empty.")
            return
        }
        console.log(window.serverUrl);
        var contdata = {
            name: this.state.name,
            mobile: this.state.mobile,
        };
        //console.log("add contact:" + contdata);
        var apiRoute = 'api/UserEmergency/create';
        this.apis.callApi(apiRoute,contdata,this.addSuccess.bind(this),this.regError.bind(this))
        //close the popup
        this.handleClose();
    };

    handleEdit(index) {

        console.log(window.serverUrl);
        var contData = {
            pre: {
                name: this.state.activeItemName,
                mobile: this.state.activeMobile,
            },
            now: {
                name: this.state.name,
                mobile: this.state.mobile,
            }
        };
        console.log("contData:" + contData);
        var apiRoute = 'api/UserEmergency/edit';
        this.apis.callApi(apiRoute,contData,this.editSuccess.bind(this),this.regError.bind(this))
        //close the popup
        this.handleEditClose();

    }
    handleDelete(index) {
        console.log(window.serverUrl);
        var list = JSON.parse(localStorage.localContactList)
        var result = list.splice(index, 1);
        console.log("splice result:" + result);
        localStorage.localContactList = JSON.stringify(list);
        this.updateContactList();

        // var contdata = {
        //     name: this.state.name,
        //     mobile: this.state.mobile,
        // };
        // //console.log("add contact:" + contdata);
        // var apiRoute = 'api/UserEmergency/create';
        // this.apis.callApi(apiRoute,contdata,this.addSuccess.bind(this),this.regError.bind(this))
        // this.retrieveEmergencies();
        

    }

    editSuccess(data) {
        console.log("Success")
        this.retrieveEmergencies();
        //jump to next page
    }
    
    addSuccess(data) {
        console.log("Success")
        this.retrieveEmergencies();
        //jump to next page
    }
    regSuccess(data) {
        console.log("Success")
        //jump to next page
    }

    regError(jqXHR) {
        this.state.errors = [];
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

    retrieveEmergencies() {
        console.log(window.serverUrl);
        var apiRoute = 'api/UserEmergency/retrieveEmergencies';
        if (this.props.isLogin)
            this.apis.callApi(apiRoute,'',this.retrieveSuccess.bind(this),this.regError.bind(this));
    
        else
            this.state.contactList=[]
        }

    retrieveSuccess(reply) {
        console.log("Success")
        if (this.props.isLogin){
            this.state.contactList = JSON.parse(JSON.parse(reply).data)
            localStorage.setItems("localContactList",this.state.contactList);
        }
            
        //jump to next page
    }

    updateContactList() {
        
        if (localStorage.getItem('localContactList')) {
            console.log(localStorage.getItem('contactList'));
            this.setState({ contactList: JSON.parse(localStorage.localContactList) })
        }
        else {
            this.setState({ contactList: [] })
        }
        
    }



    render() {
        const { classes } = this.props;
        
        return (
            <Paper className={classes.paper}>
                <AppBar color="secondary" position="static">
                    <Toolbar className={classes.toolbar}>
                        <Typography
                            variant="h6"
                            color="inherit"
                            >
                            Emergency Contacts
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                                        
                    <Fab
                        variant="extended"
                        size="medium"
                        color="secondary"
                        aria-label="Add"
                        className={classes.addNewButton}
                        onClick={this.handleOpen}
                    >
                        <AddIcon />
                        Add New
                    </Fab>
                    <Modal
                        aria-labelledby="New-Emergency-Contact"
                        aria-describedby="adds-new-emergency-contact"
                        open={this.state.open}
                        onClose={this.handleClose}
                        >
                        <div style={getModalStyle()} className={classes.modalPaper}>
                        <Typography gutterBottom align='left' variant="h6">
                                New Emergency Contact
                            </Typography>
                            
                            <TextField
                                id="cantactName"
                                label="Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                type='text'
                                inputProps={{maxlength:'10'}}
                                margin="normal"
                            />
                            <TextField
                                id="cantactMobile"
                                label="Mobile"
                                className={classes.textField}
                                value={this.state.mobile}
                                onChange={this.handleChange('mobile')}
                                type='number'
                                inputProps={{ maxlength:'10'}}
                                margin="normal"
                            />

                            <Fab
                                variant="extended"
                                color="secondary"
                                aria-label="Cancel"
                                className={classes.customLeftButton}
                                onClick={this.handleClose}
                            >
                                Cancel
                            </Fab>

                            <Fab
                                variant="extended"
                                color="secondary"
                                aria-label="Save"
                                className={classes.customRightButton}
                                onClick={this.handleAddNew}
                            >
                                Save
                            </Fab>
                        </div>
                    </Modal>
                </div>

                <div className={classes.contacts}>
                        <Grid
                            container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                            spacing={8}
                        >
                            
                            {this.state.contactList.map(function (item, i) {
                                return (
                                    <Grid key={i} item xs={12} md={6} lg={3}>
                                        <Card className={classes.contCard} >
                                            <CardContent >
                                                <EditIcon
                                                    className={classes.editIconButton}
                                                    color="secondary"
                                                    fill="secondary"
                                                    float="right"
                                                    onClick={() => {this.handleEditOpen(i,item)}} 
                                                >
                                                </EditIcon>
                                                <Modal
                                                    aria-labelledby="Edit-Emergency-Contact"
                                                    aria-describedby="edits-emergency-contact"
                                                    open={this.state.isOpen}
                                                    onClose={this.handleEditClose}
                                                    >
                                                    <div style={getModalStyle()} className={classes.modalPaper}>
                                                    <Typography gutterBottom align='left' variant="h6">
                                                            Emergency Contact
                                                        </Typography>
                                                        
                                                        <TextField
                                                            id="cantactName"
                                                            label="Name"
                                                            className={classes.textField}
                                                            defaultValue={this.state.activeItemName}
                                                            value={this.state.name}
                                                            onChange={this.handleChange('name')}
                                                            type='text'
                                                            inputProps={{maxlength:'10'}}
                                                            margin="normal"
                                                        />
                                                        <TextField
                                                            id="cantactMobile"
                                                            label="Mobile"
                                                            className={classes.textField}
                                                            defaultValue={this.state.activeMobile}
                                                            value={this.state.mobile}
                                                            onChange={this.handleChange('mobile')}
                                                            type='number'
                                                            inputProps={{ maxlength:'10'}}
                                                            margin="normal"
                                                        />

                                                        <Fab
                                                            variant="extended"
                                                            color="secondary"
                                                            aria-label="Cancel"
                                                            className={classes.customLeftButton}
                                                            onClick={this.handleEditClose}
                                                        >
                                                            Cancel
                                                        </Fab>

                                                        <Fab
                                                            variant="extended"
                                                            color="secondary"
                                                            aria-label="Save"
                                                            className={classes.customRightButton}
                                                            onClick={() => { this.handleEdit(this.state.activeIndex) }}
                                                        >
                                                            Save
                                                        </Fab>
                                                    </div>
                                                </Modal>
                                                
                                                <IconButton 
                                                    className={classes.deleteIconButton}
                                                    aria-label="Delete"
                                                    color="secondary"
                                                    onClick={() => { this.handleDelete(i) }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Typography className={classes.cont} gutterBottom align='left' variant="h6">
                                                    Name: {item.name}
                                                </Typography>
    
                                                <Typography className={classes.cont} gutterBottom align='left' variant="subtitle2">
                                                    Mobile:  {item.mobile}
                                                </Typography>    
    
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                            );
                            }.bind(this))}
                            
                        
                        </Grid>
                    </div>
                    <span className={classes.buttons}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            onClick={()=>{this.props.history.push('/')}}
                        >
                            Skip
                        </Button>
                        <Button
                            style={{ float: "right" }}
                            variant="contained"
                            className={classes.button}
                            color="secondary"
                            onClick={()=>{this.props.history.push('/')}}
                        >
                            Done
                        </Button>
                    </span>              
            </Paper>

        );
    }
}

EmergencyContacts.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(EmergencyContacts);