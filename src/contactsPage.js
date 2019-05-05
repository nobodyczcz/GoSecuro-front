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

    paper: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex: 899,
    },
    content: {
        marginTop: "35%",
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
        height:"100px",
        marginBottom:theme.spacing.unit * 2,
    },
    cont: {
        width: '100%'
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
class ContactsPage extends React.Component {
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
                        activeItemName: item.name,
                        activeMobile: item.mobile,
                        activeIndex:index
        });
    };

    handleEditClose = () => {
        this.setState({ isOpen: false});
    };

    componentDidMount() {
        if(this.props.isLogin){
            this.retrieveEmergencies();
            if (localStorage.userName) {
                this.setState({ userName: localStorage.userName })
            }
            else {
                localStorage.setItem('localUserName', '')
                this.setState({ userName: localStorage.userName })

            }

        }
        else{
            if (localStorage.userName) {
                this.setState({ userName: localStorage.userName })
            }
            else {
                localStorage.setItem('userName','')
            }

        }        
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

    handleUserNameChange = event => {
        this.setState({ userName: event.target.value });
        localStorage.userName = event.target.value
    };

    handleAddNew = () => {
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
            this.apis.callApi(apiRoute,contdata,this.addSuccess.bind(this),this.regError.bind(this))
            
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
        //jump to next page
    }

    updateContactList() {

        if(this.props.isLogin){
            if (localStorage.getItem('localContactList')) {
                console.log(localStorage.getItem('localContactList'));
                this.setState({ contactList: JSON.parse(localStorage.localContactList) })
            }
        }
        else{
        
            if (localStorage.getItem('contactList')) {
                console.log(localStorage.getItem('contactList'));
                this.setState({ contactList: JSON.parse(localStorage.contactList) })
            }
            else {
                this.setState({ contactList: [] })
            }
        }
        
    }

    handleEdit(index) {

        if(this.props.isLogin){
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
    handleDelete(index,mobileNumber) {
        
        console.log(window.serverUrl);

        if(this.props.isLogin){
            var contdata = {
                EmergencyContactPhone: mobileNumber,
            };
            var apiRoute = 'api/UserEmergency/delete';
            this.apis.callApi(apiRoute,contdata,this.addSuccess.bind(this),this.regError.bind(this))
            
        }
        else{
        var list = JSON.parse(localStorage.localContactList)
        var result = list.splice(index, 1);
        console.log("splice result:" + result);
        localStorage.localContactList = JSON.stringify(list);
        this.updateContactList();
        }

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
        console.log("Success")
        if (this.props.isLogin) {
            this.setState({ contactList: JSON.parse(JSON.parse(reply).data) });
            localStorage.setItem("localContactList", JSON.stringify(this.state.contactList));
        }

        this.setState({ loading: false });            
        //jump to next page
    }

    editSuccess(data) {
        console.log("Success")
        this.retrieveEmergencies();
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
        return (
            <Paper className={classes.paper}>
                <div className={classes.content}>
                    
                    <TextField
                        id="userName"
                        label="Your Name"
                        className={classes.textField}
                        value={this.state.userName}
                        onChange={this.handleUserNameChange}
                        type='text'
                        inputProps={{maxLength:'10'}}
                        margin="normal"
                    />
                    <Typography id='headerText' className={classes.mainText} color="secondary" gutterBottom align='left' variant='h5'>
                        Emergency Contacts
                    </Typography> 
                    
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
                        
                            {this.state.loading ? <CircularProgress size={30} color="secondary" className={classes.progress} />:null}
                     
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
                                                    onClick={function(){this.handleEditOpen(i,item)}.bind(this)} 
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
                                                            onClick={function(){ this.handleEdit(this.state.activeIndex) }.bind(this)}
                                                        >
                                                            Save
                                                        </Fab>
                                                    </div>
                                                </Modal>
                                                
                                                <IconButton 
                                                    className={classes.deleteIconButton}
                                                    aria-label="Delete"
                                                    color="secondary"
                                                    onClick={function(){ this.handleDelete(i,item.EmergencyContactPhone) }.bind(this)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                                <Typography className={classes.cont} gutterBottom align='left' variant="h6">
                                                    Name: {item.ECname}
                                                </Typography>
    
                                                <Typography className={classes.cont} gutterBottom align='left' variant="subtitle2">
                                                    Mobile:  {item.EmergencyContactPhone}
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

ContactsPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ContactsPage);