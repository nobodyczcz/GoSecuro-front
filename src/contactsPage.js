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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import { withStyles } from '@material-ui/core/styles';
import { FormHelperText } from '@material-ui/core';



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
        left:`calc( 100% - 125px )`,
        marginTop: "5px"
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
        //marginTop: theme.spacing.unit * 15,
    },
    content: {
        marginTop: theme.spacing.unit * 16,
        padding: '3%',
    },
    contacts: {
        height:"45%",
        overflowY: "scroll",
        paddingLeft: '4%',
        paddingRight: '3%',
    },
    contCard: {
        width: '100%',
        height: theme.spacing.unit * 10,
        //padding: "2%",
        //display: "flex",
        marginBottom:theme.spacing.unit * 2,
    },
    cardContent:{
        padding: '3%'
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
    infoText: {
        color: '#757575',
        fontSize: 'smaller'
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
    progress: {
    marginLeft: theme.spacing.unit * 20,
    padding: '5px'
    },
    NoContacts:{
        justifyContent: "center"
    },
    infoIcon:{
        float: "right",
        marginBottom: "2px"
    },
    notification:{
        width: "90%",
        justifyContent: "center",
        top: theme.spacing.unit * 30,
        left: 'calc( 100% - 95%)',
        opacity: 0.9,
    }
});
class ContactsPage extends React.Component {
    constructor(props) {
        super(props);

        console.log('rendering contacts page')
        
        this.apis = new APIs();
        this.state = {
            name: '',
            mobile: '',
            open:false,
            contactList:[],
            loading: true,
            errors: [],
            isOpen:false,
            activeItemName: '',
            activeMobile: '',
            activeIndex:'',
            noContacts: false,
            showInfo: false,
            showDialog: false
        };

    }

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    handleEditOpen = (index,item) => {
        console.log(item)
        this.setState({ isOpen: true,
                        activeItemName: item.ECname,
                        activeMobile: item.EmergencyContactPhone,
                        activeIndex:index,
                        name:item.ECname,
                        mobile:item.EmergencyContactPhone,
        });
    };

    handleEditClose = () => {
        this.setState({ isOpen: false,
            activeItemName: '',
            activeMobile: '',
            activeIndex:'',
            name:'',
            mobile: '',
});
    };

    componentWillMount() {
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
        this.setState({ loading: true });
        if (this.state.name.length === 0 || this.state.mobile.length === 0) {
            console.log("empty")
            return
        }
        console.log(window.serverUrl);
        console.log('create new contact list')

        if(this.props.isLogin){
            var contdata = {
                EmergencyContactPhone: this.state.mobile,
                ECname: this.state.name,
            };
            var apiRoute = 'api/UserEmergency/create';
            this.apis.callApi(apiRoute,contdata,this.addSuccess.bind(this),this.addError.bind(this))
        }
        else{
            if (!localStorage.contactList) {
                //console.log('create new contact list')
                var list = JSON.stringify([]);
                localStorage.setItem('contactList', list);
            };
            console.log(localStorage['contactList'])
            
            var list = JSON.parse(localStorage.contactList)
            list.push({
                name: this.state.name,
                mobile: this.state.mobile
            });
    
            localStorage.contactList = JSON.stringify(list)
            this.updateContactList()
            this.setState({ name: '', mobile: '' });
        }

        //close the popup
        this.handleClose();
    };

    addSuccess(data) {
        console.log("Emergency Contact successfully added")
        this.retrieveEmergencies();

        this.setState({ loading: false, noContacts: false,name: '', mobile: '' });
        //jump to next page
    }

    updateContactList() {
        this.setState({ loading: true });

        if (localStorage.getItem('contactList')) {
            console.log(localStorage.getItem('contactList'));
            this.setState({ contactList: JSON.parse(localStorage.contactList) })
        }
        else {
            this.setState({ contactList: [] })
        }
        
        this.setState({ loading: false });
        
    }

    handleEdit(index) {

        if(this.props.isLogin){
            var contData = {
                pre: {
                    ECname: this.state.activeItemName,
                    EmergencyContactPhone: this.state.activeMobile,
                },
                now: {
                    ECname: this.state.name,
                    EmergencyContactPhone: this.state.mobile,
                }
            };
            console.log("contData:" + contData);
            var apiRoute = 'api/UserEmergency/edit';
            this.apis.callApi(apiRoute,contData,this.editSuccess.bind(this),this.regError.bind(this))
        }
        else{
            var list = JSON.parse(localStorage.contactList)
            list.splice(index, 1,{
                name: this.state.name,
                mobile: this.state.mobile
            });
            localStorage.contactList = JSON.stringify(list);
            this.updateContactList();
        }
        //close the popup
        this.handleEditClose();
    }

    handleClickDelete(){
        this.setState({ showDialog: true})
    }

    /* Function that handles cancel of delete contact
    *
    * Start
    * */
    handleCancelDelete(){
        this.setState({showDialog: false})
    }
    /* Function that handles cancel of delete contact
    *
    * Finish
    * */

    handleDelete(index,mobileNumber) {
        this.setState({showDialog: false})
        console.log(window.serverUrl);

        if(this.props.isLogin){
            var contdata = {
                EmergencyContactPhone: mobileNumber,
            };
            var apiRoute = 'api/UserEmergency/delete';
            this.apis.callApi(apiRoute,contdata,this.deleteSuccess.bind(this),this.regError.bind(this))
            
        }
        else{
            var list = JSON.parse(localStorage.localContactList)
            var result = list.splice(index, 1);
            console.log("splice result:" + result);
            localStorage.localContactList = JSON.stringify(list);
            this.updateContactList();
        }

    }

    deleteSuccess(data) {
        console.log("Emergency Contact successfully deleted")
        this.retrieveEmergencies();

        this.setState({ loading: false });
        this.setState({ name: '', mobile: '' });
        //jump to next page
    }

    retrieveEmergencies() {
        this.setState({ loading: true });

        console.log(window.serverUrl);
        console.log("Retrieving emergency contacts");
        var apiRoute = 'api/UserEmergency/retrieveEmergencies';
        if (this.props.isLogin)
            this.apis.callApi(apiRoute,'',this.retrieveSuccess.bind(this),this.regError.bind(this));
    
        else
            this.updateContactList();
        
        
    }

    retrieveSuccess(reply) {
        this.setState({noContacts : false});
        console.log("Success")
        if (this.props.isLogin) {
            this.setState({ contactList: JSON.parse(JSON.parse(reply).data) });
            localStorage.setItem("localContactList", JSON.stringify(this.state.contactList));
        }
        if(JSON.parse(JSON.parse(reply).data).length == 0){
           this.setState({noContacts : true});
        }
        else
            this.setState({noContacts: false})
        
        this.setState({ loading: false });            
        //jump to next page
    }

    editSuccess(data) {
        console.log("Success")
        this.retrieveEmergencies();
        //jump to next page
    }
    regError(jqXHR) {
        this.state.errors=[];
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
        this.setState({ loading: false });
        try{
            var theError = JSON.parse(this.state.errors[0]);
            this.handleShowNoti(theError.result+' '+ theError.errors);
        }
        catch{

        }
        
    }
    addError(jqXHR) {
        this.setState.errors=[];
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
        this.setState({ loading: false,name: '', mobile: '' });

        console.log(this.state.errors)
        try{
            var theError = JSON.parse(this.state.errors[0]);
            this.handleShowNoti(theError.result+' '+ theError.errors);
        }
        catch{

        }
    }
    
    /*Notification snapbar related functions
     * 
     * 
     */
    handleShowNoti = (content) => {
        this.setState({ showNotification: true,notiContent:content });
      };

    handleNotiClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({ showNotification: false,notiContent:'' });
      };
    /*Notification snapbar functions
     * 
     * finish
     */

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

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <div className={classes.content}>
                    
                    <Typography id='headerText' className={classes.mainText} color="secondary" gutterBottom align='left' variant='h5'>
                        Emergency Contacts
                        <Fab onClick={this.handleInfoClick.bind(this)} color="primary" size="small" className={classes.infoIcon}>
                        <InfoIcon />
                    </Fab>
                    </Typography>
                    
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
                        message={<span id="message-id">You can add your close and trusted ones as your emergency contacts. Do get in touch with them so that they can always be available for you!.</span>}
                        
                    />
                    {/* <Typography className={classes.infoText}>
                        You can add your close and trusted ones as your emergency contacts. Do get in touch with them so that they can always be available for you!
                    </Typography> */}
                    
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
                        onClose={this.handleClose.bind(this)}
                        >
                        <div style={getModalStyle()} className={classes.modalPaper}>
                        <Typography gutterBottom align='left' variant="h6">
                                New Emergency Contact
                            </Typography>
                            
                            <TextField
                                id="cantactName"
                                label="Name*"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                type='text'
                                inputProps={{maxlength:'20'}}
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

                            <FormHelperText>Emergency Contact will only be sent text messages in case of emergencies.</FormHelperText>
                            <Fab
                                variant="extended"
                                color="secondary"
                                aria-label="Cancel"
                                className={classes.customLeftButton}
                                onClick={this.handleClose.bind(this)}
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

                        
                            {this.state.loading ? <CircularProgress size={30} color="secondary" className={classes.progress} />:null}
                            {this.state.noContacts ? 
                                <Typography variant="h6">
                                    No Emergency Contacts.
                                </Typography>
                                :
                                null
                            }
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
                                                <EditIcon
                                                    className={classes.editIconButton}
                                                    color="secondary"
                                                    fill="secondary"
                                                    float="right"
                                                    onClick={function(){this.handleEditOpen(i,item)}.bind(this)} 
                                                >
                                                </EditIcon>
                                                
                                                <IconButton 
                                                    className={classes.deleteIconButton}
                                                    aria-label="Delete"
                                                    color="secondary"
                                                    onClick={this.handleClickDelete.bind(this)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Dialog
                                                    open={this.state.showDialog}
                                                    onClose={this.handleCancelDelete.bind(this)}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                    >
                                                    <DialogTitle id="alert-dialog-title">{"Delete Emergency Contact?"}</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                        Are you sure you want to delete the emergency contact?
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={this.handleCancelDelete.bind(this)} color="secondary">
                                                        Cancel
                                                        </Button>
                                                        <Button onClick={function(){ this.handleDelete(i,item.EmergencyContactPhone) }.bind(this)} color="secondary" autoFocus>
                                                        Confirm
                                                        </Button>
                                                    </DialogActions>
                                                    </Dialog>
                                                <Typography className={classes.contName} gutterBottom align='left' variant="h6">
                                                    {item.ECname}<br/>
                                                    {item.EmergencyContactPhone}
                                                </Typography>
    
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                            );
                            }.bind(this))}
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
                                        onClick={function(){ this.handleEdit(this.state.activeIndex) }.bind(this)}
                                    >
                                        Save
                                    </Fab>
                                </div>
                            </Modal>
                        </Grid>
                    </div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.showNotification}
                        autoHideDuration={3000}
                        onClose={this.handleNotiClose}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.notiContent}</span>}
                        action={[
                            <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            className={classes.close}
                            onClick={this.handleNotiClose}
                            >
                            <CloseIcon />
                            </IconButton>,
                        ]}
                    />
            </Paper>

        );
    }
}

ContactsPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ContactsPage);