import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
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
import { Link } from "react-router-dom";
import classnames from 'classnames';
import CardActions from '@material-ui/core/CardActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';





const drawerWidth = 240;
const drawerHeight = 400;
const styles = theme => ({
    root: {
        display: 'flex',
    },
    contentCard: {
        padding:5,
        display:'flex',
        justifyContent:'space-between',
        minHeight: 100,
        height:100,
        marginTop: theme.spacing.unit * 1,
    },
    routeInfoCard: {
        minHeight: 100,
        marginTop: theme.spacing.unit * 1
    },
    routeInfoHeader:{
        paddingTop:'8px',
        paddingLeft:'8px',
        paddingRight:'8px',
        paddingBottom:0,
    },
    media: {
        minHeight: 100,
        height: 100,
        minWidth: 100,
        width: '25%',
        borderRadius: 5,
    },
    cardContent: {
        width:'65%',
        flexDirection: 'row',
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        display: 'flex',
        width:"100%",
        justifyContent: 'stretch',
        alignItems:"center",
    },
    subToolbar: {
        display: 'flex',
        width:"100%",
        justifyContent: 'flex-end',
        alignItems:"center",
    },
    drawerTriger: {
        width: "100%",
        display: 'flex',
        justifyContent: 'left',
        zIndex:1200
    },
    contentPaper: {
        overflowX: 'hidden',
        height:"100%",
    },
    drawer: {

        boarderRadius: 10,
        flexShrink: 0,
    },
    drawerPaper:{
    },
    drawerOpen: {
        paddingLeft: '3%',
        paddingRight:'3%',
        overflowX: 'hidden',
        overflowY: 'hidden',
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
        height: "100px",
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
        left: 'calc( 50% - 40px)',
        transition: theme.transitions.create('top', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

    },
    panicClose: {
        zIndex: 1300,

        position: 'fixed',
        top: 'calc( 100% - 100px)',
        left: 'calc( 50% - 40px)',
        transition: theme.transitions.create('top', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

    },
    startNavi: {
        height: "30px",
        minWidth: "90px",
        left: "-90px",
        zIndex:1300
    },
    showDetails:{
        color:'gray'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      actions: {
        display: 'flex',
        height:'48px',
      },
      highCrime:{
        backgroundColor:'#f44336'
      },
      mediumCrime:{
        backgroundColor:'#fb8c00'
      },
      lowCrime:{
        backgroundColor:'#43a047'

      },
      details:{
          display:'flex',
          justifyContent:'space-between',
      }
});

class ResultCard extends Component {
    constructor(props) {
        
        
        super(props);
        this.state = {
            open: true,
            Hexpanded: false,
            Mexpanded: false,
            Lexpanded: false,
            navWithShare:false,

        };
    };
    componentDidMount(){
        if(this.props.currentRoute){
            var mode = this.props.currentRoute.request.travelMode.toLowerCase()
            var suburbs = this.props.routeAnalysis[mode].suburbs
            if(suburbs.highCrime.length>0){
                this.setState({navWithShare:true})
            }
        }
    }

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
        this.props.map.setZoom(18);
    };
    handleNavClick = (index) => {
        this.props.navigateTo(this.props.results[index].geometry.location);
    }
    handleStartNav() {
        if (window.cordova) {
            console.log("Start tracking. start location:" + JSON.stringify(this.props.getLocation()));
            
            if(this.state.navWithShare){
                if (this.props.alreadyTracking) {
                    this.props.locationSharing.stopTracking()
                }
                this.props.locationSharing.navigationRoute = JSON.stringify({
                    overview_path: this.props.currentRoute.routes[0].overview_path,
                    origin: this.props.currentRoute.request.origin.location,
                    destination: this.props.currentRoute.request.destination.location,
                    duration: this.props.currentRoute.routes[0].legs[0].duration.value,
                });
                this.props.locationSharing.startTracking(this.props.getLocation());
            }
            
        }
        else { console.log("tracking do not work in broswer enviroment") }

        this.props.history.push('/navigation')
    }

    handleExpandClick = (name) => {
        this.setState(state => ({ [name]: !state[name] }));
      };

      handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
      };
    
    render() {
       
        const { classes, theme } = this.props;
        if(this.props.currentRoute){
            var mode = this.props.currentRoute.request.travelMode.toLowerCase()
            var suburbs = this.props.routeAnalysis[mode].suburbs
        }
        
        return (
            <div>
                <div className={
                    classNames({
                        [classes.panicOpen]: this.state.open,
                        [classes.panicClose]: !this.state.open,
                    })
                    
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
                        paper: classNames(classes.drawerPaper,{
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }),
                    }}
                    open={this.state.open}
                >
                
                    <div className={classes.toolbar}>
                            <IconButton className={classes.drawerTriger} onClick={this.handleDrawerChange}>
                                {this.state.open ? <ChevronDownIcon /> : <ChevronUpIcon />}
                                Results
                            </IconButton>
                            {
                            this.props.currentRoute ?
                                <Fab variant="extended" color="secondary" className={classes.startNavi} onClick={this.handleStartNav.bind(this)}>
                                        Start
                                        <NavigationIcon /> 
                                </Fab>
                                    : null
                            }
                    </div>
                    {
                        this.props.currentRoute ?
                        <div className={classes.subToolbar}>
                            <Typography variant="body1">
                                Share location when navigating
                            </Typography>
                            <Switch
                                checked={this.state.navWithShare}
                                onChange={this.handleChange('navWithShare')}
                                value="navWithShare"
                            />

                        </div>
                            : null
                    }
                    <div className={classes.contentPaper}>
                        {
                        this.props.currentRoute ?
                            <div>
                                {
                                    suburbs.highCrime.length>0 ? <p className={classes.warning}>You will pass through {suburbs.highCrime.length} high crime rate suburbs. We suggest you use location share function when navigating</p>:null
                                }
                                {
                                    suburbs.highCrime.length>0 ? 
                                    <Card className={classes.routeInfoCard}>
                                    <CardHeader 
                                    className={classes.routeInfoHeader}
                                    avatar={
                                        <Avatar aria-label="High Crime Rate" className={classes.highCrime}>
                                          H
                                        </Avatar>
                                      }
                                    title={suburbs.highCrime.length+' High Crime Rate Suburbs'}
                                    titleTypographyProps={{variant:'h5'}}
                                     />
                                        
                                    <CardActions className={classes.actions} disableActionSpacing>
                                        <Typography variant="body2">
                                            Details
                                        </Typography>
                                        <IconButton
                                            className={classnames(classes.expand, {
                                            [classes.expandOpen]: this.state.Hexpanded,
                                            })}
                                            onClick={()=>{this.handleExpandClick('Hexpanded')}}
                                            aria-expanded={this.state.Hexpanded}
                                            aria-label="Show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={this.state.Hexpanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <div className={classes.details} >
                                            <Typography variant='h6' >
                                                Suburb
                                            </Typography>
                                            <Typography variant='h6'>
                                                Crime Rate
                                            </Typography>
                                        </div>
                                        {suburbs.highCrime.map((item,index)=>{

                                            return(
                                                <div className={classes.details} key={item.properties.suburb} >
                                                    <Typography variant='body1' >
                                                        {item.properties.suburb}
                                                    </Typography>
                                                    <Typography variant='body1' >
                                                        {item.properties.crimeRate}
                                                    </Typography>
                                                </div>

                                            )
                                        })}
                                       
                                    </CardContent>
                                    </Collapse>
                                    </Card>
                                    : null
                                }
                                {
                                    suburbs.mediumCrime.length>0 ? 
                                    <Card className={classes.routeInfoCard}>
                                    <CardHeader 
                                    className={classes.routeInfoHeader}
                                    avatar={
                                        <Avatar aria-label="Medium Crime Rate" className={classes.mediumCrime}>
                                          M
                                        </Avatar>
                                      }
                                    title={suburbs.mediumCrime.length+' Medium Crime Rate Suburbs'}
                                    titleTypographyProps={{variant:'h5'}}
                                     />
                                        
                                    <CardActions className={classes.actions} disableActionSpacing>
                                        <Typography variant="body2">
                                            Details
                                        </Typography>
                                        <IconButton
                                            className={classnames(classes.expand, {
                                            [classes.expandOpen]: this.state.Mexpanded,
                                            })}
                                            onClick={()=>{this.handleExpandClick('Mexpanded')}}
                                            aria-expanded={this.state.Mexpanded}
                                            aria-label="Show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={this.state.Mexpanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <div className={classes.details} >
                                            <Typography variant='h6' >
                                                Suburb
                                            </Typography>
                                            <Typography variant='h6'>
                                                Crime Rate
                                            </Typography>
                                        </div>
                                        {suburbs.mediumCrime.map((item,index)=>{

                                            return(
                                                <div className={classes.details} key={item.properties.suburb}>
                                                    <Typography variant='body1' >
                                                        {item.properties.suburb}
                                                    </Typography>
                                                    <Typography variant='body1' >
                                                        {item.properties.crimeRate}
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                       
                                    </CardContent>
                                    </Collapse>
                                    </Card>
                                    : null
                                }
                                {
                                    suburbs.lowCrime.length>0 ? 
                                    <Card className={classes.routeInfoCard}>
                                    <CardHeader 
                                    className={classes.routeInfoHeader}
                                    avatar={
                                        <Avatar aria-label="Low Crime Rate" className={classes.lowCrime}>
                                          L
                                        </Avatar>
                                      }
                                    title={suburbs.lowCrime.length+' Low Crime Rate Suburbs'}
                                    titleTypographyProps={{variant:'h5'}}
                                     />
                                        
                                    <CardActions className={classes.actions} disableActionSpacing>
                                        <Typography variant="body2">
                                            Details
                                        </Typography>
                                        <IconButton
                                            className={classnames(classes.expand, {
                                            [classes.expandOpen]: this.state.Lexpanded,
                                            })}
                                            onClick={()=>{this.handleExpandClick('Lexpanded')}}
                                            aria-expanded={this.state.Lexpanded}
                                            aria-label="Show more"
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    </CardActions>
                                    <Collapse in={this.state.Lexpanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <div className={classes.details} >
                                            <Typography variant='h6' >
                                                Suburb
                                            </Typography>
                                            <Typography variant='h6'>
                                                Crime Rate
                                            </Typography>
                                        </div>
                                        {suburbs.lowCrime.map((item,index)=>{

                                            return(
                                                <div className={classes.details} key={item.properties.suburb}>
                                                    <Typography variant='body1' >
                                                        {item.properties.suburb}
                                                    </Typography>
                                                    <Typography variant='body1' >
                                                        {item.properties.crimeRate}
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                       
                                    </CardContent>
                                    </Collapse>
                                    </Card>
                                    : null
                                }
                                {
                                <Card className={classes.routeInfoCard}>
                                    <CardHeader 
                                        className={classes.routeInfoHeader}
                                        avatar={
                                            <Avatar aria-label="Route Info" className={classes.lowCrime}>
                                            R
                                            </Avatar>
                                        }
                                        title='Route Information'
                                        titleTypographyProps={{variant:'h5'}}
                                     />

                                    <CardContent >
                                        <div className={classes.details}>
                                            <Typography variant='h6' >
                                                Distance
                                            </Typography>
                                            <Typography variant='h6'>
                                                {this.props.currentRoute.routes[0].legs[0].distance.text}
                                            </Typography>
                                         </div>
                                         <div className={classes.details}>
                                            <Typography variant='h6' >
                                                Duration
                                            </Typography>
                                            <Typography variant='h6'>
                                                {this.props.currentRoute.routes[0].legs[0].duration.text}
                                            </Typography>
                                         </div>
                                        
                                    </CardContent>
                                        
                                        <CardActions className={classes.actions} disableActionSpacing>
                                        <Link 
                                            className={classes.showDetails}
                                            to='/routeDetail'
                                            >
                                            View Route Details
                                        </Link>
                                    </CardActions>

                                </Card>
                                }
                                
                            </div>
                            
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
                                            size="small"
                                            color="primary"
                                            aria-label="Add"
                                            className={classes.navButton}
                                            onClick={() => { this.handleNavClick(i) }}
                                        >
                                            <NavigationIcon />
                                        </Fab>
                                    </Card>
                                )
                            }.bind(this))
                        }
                    </div>
                
                 </Drawer>
            </div>
        )
    };
}

export default withStyles(styles, { withTheme: true })(ResultCard);