import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Drawer from '@material-ui/core/Drawer';

import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import ChevronUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ChevronDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import NavigationIcon from '@material-ui/icons/Navigation';
import Fab from '@material-ui/core/Fab';
import PanicButton from './panicButton.js';





const drawerWidth = 240;
const drawerHeight = 400;
const styles = theme => ({
    root: {
        display: 'flex',
    },
    contentCard: {
        padding:5,
        display:'flex',
        minHeight: 100,
        height:100,
        marginTop: theme.spacing.unit * 1
    },
    media: {
        minHeight: 100,
        height: 100,
        minWidth: 100,
        width: 100,
        borderRadius: 5,
    },
    cardContent: {
        flexDirection: 'column',
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        positon: 'fixed',
        justifyContent: 'center',
    },
    drawer: {

        boarderRadius: 10,
        flexShrink: 0,
    },
    drawerOpen: {
        paddingLeft: '3%',
        paddingRight:'3%',
        overflowX: 'hidden',
        height: '40%',
        borderRadius: '5px 5px 0px 0px',
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {

        paddingLeft: '3%',
        paddingRight: '3%',
        borderRadius: '5px 5px 0px 0px',
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowY: 'hidden',
        overflowX: 'hidden',
        height: "10%",
    },
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }
    },
    navButton: {
        marginTop:60,
    },

    panicOpen: {
        position: 'fixed',
        zIndex: 1300,
        top: 'calc( 75% - 150px)',
        left: 'calc( 50% - 50px)',
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

    },
    panicClose: {
        zIndex: 1300,

        position: 'fixed',
        top: 'calc( 100% - 120px)',
        left: 'calc( 50% - 50px)',
        transition: theme.transitions.create('height', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

    },
});

class ResultCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        };
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };
    handleDrawerChange = () => {
        this.setState({ open: !this.state.open });
    }
    handleCardClick = (index) => {
        console.log(index)
        var location = this.props.results[index].geometry.location;
        this.props.map.setCenter(location);
    };
    handleNavClick = (index) => {
        this.props.navigateTo(this.props.results[index].geometry.location);
    }
    
    render() {
        console.log('render result: ',this.props.currentRoute);
        const { classes, theme } = this.props;
        return (
            <div>
                <div className={
                    this.state.open ? classes.panicOpen : classes.panicClose
                }>
                    <PanicButton getLocation={this.props.getLocation} />
                </div>
            <Drawer
                anchor="bottom"
                variant="permanent"
                className={classNames(classes.drawer, {
                    [classes.drawerOpen]: this.state.open,
                    [classes.drawerClose]: !this.state.open,
                })}
                classes={{
                    paper: classNames({
                        [classes.drawerOpen]: this.state.open,
                        [classes.drawerClose]: !this.state.open,
                    }),
                }}
                open={this.state.open}
            >
                
                
                
                <div className={classes.toolbar}>
                    <IconButton onClick={this.handleDrawerChange}>
                        {this.state.open ? <ChevronDownIcon /> : <ChevronUpIcon />}
                        Search Result
                    </IconButton>
                </div>
                {
                    this.props.currentRoute ?
                        this.props.currentRoute.routes[0].legs.map(function (leg, i) {
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
                        this.props.results.map(function (item, i) {
                            var photo = "img/no-image.png"
                            var imgLink = photo
                            if (item.photos) {
                                imgLink = item.photos[0].getUrl();
                                //imgLink = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&key=" + this.props.apiKey + "&photoreference=" + photo;
                            }

                            var name = item.name;
                            var icon = item.icon;
                            var address = item.formatted_address;
                            var location = item.geometry.location;

                            return (
                                <Card className={classes.contentCard} key={i} >

                                    <CardMedia
                                        component="img"
                                        alt={photo}
                                        className={classes.media}
                                        image={imgLink}
                                        title="result photo"
                                        onClick={() => this.handleCardClick(i)}
                                    />
                                    <div
                                        className={classes.cardContent}
                                        onClick={() => this.handleCardClick(i)}
                                    >
                                        <CardContent>
                                            <Typography variant="h6">
                                                {name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {address}
                                            </Typography>

                                        </CardContent>
                                    </div>
                                    <Fab
                                        variant="extended"
                                        size="small"
                                        color="primary"
                                        aria-label="Add"
                                        className={classes.navButton}
                                        onClick={() => { this.handleNavClick(i) }}
                                    >
                                        <NavigationIcon className={classes.extendedIcon} />
                                    </Fab>
                                </Card>
                            )
                        }.bind(this))
                }
                
                </Drawer>
                </div>
        )
    };
}

export default withStyles(styles, { withTheme: true })(ResultCard);