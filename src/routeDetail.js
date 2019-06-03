import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';

import Toolbar from '@material-ui/core/Toolbar';



const styles = theme => ({
    root:{
        width:'100%',
        height:'100%',
        zIndex:1100,
    },
    top:{
        paddingTop:'20px',
    },
    topBar: {
        display: 'flex',
        justifyContent:'center',
    },
    paper:{
        position:'fixed',
        top:0,
        left:0,
        
        width:'100%',
        height:'100%',
        zIndex:1000,

    },
    content:{
        marginTop:'20%',
        overflowY: "scroll",
    },
    contentCard: {
        padding:5,
        display:'flex',
        minHeight: 100,
        height:100,
        marginTop: theme.spacing.unit * 1,
        marginLeft:theme.spacing.unit * 1,
        marginRight:theme.spacing.unit * 1,
    },
    backButton:{
        position:'fixed',
        left:'0',
    }

});
class RouteDetails extends React.Component {
    constructor(props) {
        super(props);
        this.mapCenter = null;

        this.state = {

        };

    }

    componentDidMount() {
        this.props.hideAppBar(true)
    }



    render() {

        const { classes } = this.props;
        var route = this.props.currentRoute;
        return (
            
            <Paper className={classes.paper}>
                <AppBar className={classes.top} color="secondary">
                    
                    <Toolbar className={classes.topBar}>
                        <IconButton className={classes.backButton} onClick={()=>{this.props.history.goBack()}}>
                             <ChevronLeftIcon color='primary' />
                        </IconButton>

                        <Typography className={classes.headerTitle} variant="h5" color="primary" noWrap>
                            Route Details
                        </Typography>

                        
                        
                    </Toolbar>
                </AppBar>
                
                <div className={classes.content}>
                    {
                        route?
                        route.routes[0].legs.map(function (leg, i) {
                            return (
                                <div key={i}>
                                    {
                                        leg.steps.map(function (step, x) {
                                            return (
                                                <Card className={classes.contentCard} key={i.toString() + x.toString()} >
                                                    <CardContent>
                                                        <Typography variant="subtitle2">
                                                            {step.distance.text} {step.duration.text}
                                                        </Typography>
                                                        <div dangerouslySetInnerHTML={{ __html: step.instructions }} />

                                                    </CardContent>
                                                </Card>
                                                );
                                        })
                                    }
                                </div>
                            );
                        })
                        :
                        'No Route Avaliable'
                    }
                </div>
            </Paper>
                



        );
    }
}

export default withStyles(styles)(RouteDetails);