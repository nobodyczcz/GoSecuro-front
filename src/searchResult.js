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
        height: '50%',
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
    }
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
    
    render() {
        const { classes, theme } = this.props;
        return (
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
                {this.props.results.map(function (item, i) {
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
                            />
                            <div>

                            </div>
                            <div className={classes.cardContent}>
                                <CardContent>
                                    <Typography variant="h6">
                                        {name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {address}
                                    </Typography>

                                </CardContent>
                            </div>
                        </Card>
                    )
                }.bind(this))}
            </Drawer>
        )
    };
}

export default withStyles(styles, { withTheme: true })(ResultCard);