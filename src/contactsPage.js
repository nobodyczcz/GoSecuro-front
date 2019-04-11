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



import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
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
        overflow: "scroll",
        paddingLeft: '3%',
        paddingRight: '3%',


    },
    contCard: {
        width: '100%',
        height:"140px",
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
});
class ContactsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            mobile: '',
            userName:'',
            contactList:[]
        };

    }
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
        this.setState({ [name]: event.target.value });
    };
    handleUserNameChange = event => {
        this.setState({ userName: event.target.value });
        localStorage.userName = event.target.value
    };
    handleAddNew = () => {
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
                        margin="normal"
                    />
                    <Card>
                        <CardContent>
                            <Typography gutterBottom align='center' variant="h6">
                                New Emergency Contact
                            </Typography>
                            
                            <TextField
                                id="cantactName"
                                label="Name"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChange('name')}
                                margin="normal"
                            />
                            <TextField
                                id="cantactMobile"
                                label="Mobile"
                                className={classes.textField}
                                value={this.state.mobile}
                                onChange={this.handleChange('mobile')}
                                margin="normal"
                            />

                        </CardContent>
                        <CardContent style={{paddingTop:0}}>
                            <Fab
                                variant="extended"
                                size="medium"
                                color="secondary"
                                aria-label="Add"
                                className={classes.margin}
                                onClick={this.handleAddNew}
                            >
                                <AddIcon className={classes.extendedIcon} />
                                Add New
                                </Fab>
                        </CardContent>
                    </Card>
                    <Typography gutterBottom align='center' variant="h6">
                        Emergency Contacts
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
                        {this.state.contactList.map(function (item, i) {
                            return (
                                <Grid key={i} item xs={12} md={6} lg={3}>
                                    <Card className={classes.contCard} >
                                        <CardContent >
                                            <Typography className={classes.cont} gutterBottom align='left' variant="h6">
                                                Name: {item.name}
                                            </Typography>

                                            <Typography className={classes.cont} gutterBottom align='left' variant="subtitle2">
                                                Mobile:  {item.mobile}
                                            </Typography>


                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className={classes.button}
                                                onClick={() => { this.handleDelete(i) }}
                                        >
                                                <DeleteIcon className={classes.rightIcon} />
                                                Delete
                                            </Button>
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

export default withStyles(styles)(ContactsPage);