import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: '0',
        left: '0',
        zIndex: 1100,
    }
});
class Background extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <Card>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Background
                        </Typography>
                        <Typography component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </Card>
            </Paper>
            
            );
    }
}

export default withStyles(styles)(Background);