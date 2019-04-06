import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
        marginTop: theme.spacing.unit * 17,
        height: '100%',
        padding:'3%'
    },
    body: {
        height: '70%',
    },
});
class ContactsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <div className={classes.content}>
                    <Card>
                        <CardContent>
                        <Typography gutterBottom variant="h6">
                        Name
                        </Typography>
                        <Typography gutterBottom variant="h6">
                                Mobile
                        </Typography>

                        </CardContent>
                        <CardContent>
                            <Fab
                                variant="extended"
                                size="medium"
                                color="secondary"
                                aria-label="Add"
                                className={classes.margin}
                            >
                                <AddIcon className={classes.extendedIcon} />
                                Add New
                                </Fab>
                        </CardContent>
                    </Card>
                </div>
                
            </Paper>

        );
    }
}

export default withStyles(styles)(ContactsPage);