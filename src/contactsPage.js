import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

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
        zIndex: 900,
    },
    content: {
        marginTop: "140px",
        padding: '3%',
    },
    contacts: {
        height:"100%",
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
    mainText:{
        color:'#FF7504',
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
      }
});
class ContactsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
            userName:'',
            open:false,
            contactList:[]
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
        this.updateContactList()
        if (localStorage.userName) {
            this.setState({ userName: localStorage.userName })
        }
        else {
            localStorage.setItem('userName','')
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
        if (!localStorage.contactList) {
            console.log('create new contact list')
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

        //close the popup
        this.handleClose();
    };

    updateContactList() {
        
        if (localStorage.getItem('contactList')) {
            console.log(localStorage.getItem('contactList'));
            this.setState({ contactList: JSON.parse(localStorage.contactList) })
        }
        else {
            this.setState({ contactList: [] })
        }
        
    }

    handleEdit(index) {
        var list = JSON.parse(localStorage.contactList)
        list.splice(index, 1,{
            name: this.state.name,
            mobile: this.state.mobile
        });
        localStorage.contactList = JSON.stringify(list);
        this.updateContactList();

        //close the popup
        this.handleEditClose();

    }
    handleDelete(index) {
        var list = JSON.parse(localStorage.contactList)
        list.splice(index, 1);
        localStorage.contactList = JSON.stringify(list);
        this.updateContactList();

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
                        inputProps={{maxlength:'10'}}
                        margin="normal"
                    />
                    <Typography id='headerText' className={classes.mainText} gutterBottom align='left' variant='h5'>
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
                        <AddIcon className={classes.extendedIcon} />
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
            </Paper>

        );
    }
}

ContactsPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(ContactsPage);