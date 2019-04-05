import React, { Component } from 'react';
import MainBar from './AppBar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import NavigationIon from '@material-ui/icons/Navigation';
import ContactsIon from '@material-ui/icons/Contacts';
import { withStyles } from '@material-ui/core/styles';
import postscribe from 'postscribe';
import { Router, Route, Link } from "react-router-dom";
import LayerIcon from '@material-ui/icons/Layers';
import MyLocationIcon from '@material-ui/icons/MyLocation';

import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Background from './backgroundPage';
import { createBrowserHistory, createHashHistory } from 'history';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ResultCard from './searchResult';

var history;
if (window.cordova) {
    history = new createHashHistory();
}
else {
    history = new createBrowserHistory();
}



const styles = theme => ({
    list: {
        width: 250,
    },
    layerContainer: {
        marginTop: theme.spacing.unit * 12,
        
    },
    layerIcon: {
        position:'absolute',
        left: 'calc(100% - 60px)',
        display: 'flex',
        zIndex: 1100,
    },
    myPositionIcon: {
        position: 'absolute',
        left: 'calc(100% - 60px)',
        top:'calc(100% - 100px)',
        display: 'flex',
        zIndex: 1100,
    },
    menu: {
        display: 'flex',
        zindex:1100,
    },
    layerMenu: {
        position: 'absolute',
        top: theme.spacing.unit * 12,
        width: theme.spacing.unit * 15,
    },
    fullList: {
    width: 'auto',
    }
});

const theme2 = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
  palette: {
    primary: {
        light: '#ffffff',
        main: '#ffffff',
        dark: '#bdbdbd',
        contrastText: '#ff7504',
    },
    secondary: {
      light: '#b26500',
      main: '#ff9100',
      dark: '#ffa733',
      contrastText: '#000',
    },
  },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        if (window.cordova) {
            console.log('Using cordova: initiate app')
            if (window.cordova.platformId === 'android') {
                window.StatusBar.overlaysWebView(true);
                window.StatusBar.backgroundColorByHexString('#33000000');
            }
        }
        else {
            console.log('Not using cordova: initiate app')
        };

        this.userMarker = null;

        this.focusUser = true;

        this.markers = null;

        this.userLocation = null;

        this.apiKey = 'AIzaSyAFxfzpmKW1-P7LoPmoeTjwoHrNH-Noe_0';
        
        this.mapurl = "https://maps.googleapis.com/maps/api/js?key=" + this.apiKey;

        console.log('create ref')
        this.mainBar = React.createRef();

        console.log('test data')
        this.crimeData = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'properties': {
                        'crimeRate': 0.0123,
                        'suburb': 'CAULFIELD EAST',
                    },
                    'geometry': { 'type': 'Polygon', 'coordinates': [[[145.04015202, -37.87510781], [145.04501901, -37.87603308], [145.04656539, -37.87701487], [145.04963157, -37.88102006], [145.04612801, -37.88727403], [145.03815897, -37.88628199], [145.03460303, -37.88139297], [145.03544496, -37.87685503], [145.03940597, -37.87691397], [145.04015202, -37.87510781]]] }
                },
                {
                    'type': 'Feature',
                    'properties': {
                        'suburb': 'CAULFIELD',
                        'crimeRate': 0.0502,
                    },
                    'geometry': { 'type': 'Polygon', 'coordinates': [[[145.01631003, -37.87915702], [145.02983704, -37.88085404], [145.03460303, -37.88139297], [145.03815897, -37.88628199], [145.03765696, -37.88887803], [145.01494298, -37.88603402], [145.01631003, -37.87915702]]] }
                }
            ],
        };


        console.log('set state')
        this.state = {
            left: false,
            currentPage: 'start',
            mobileMoreAnchorEl: null,
            focusUser: false,
            layerMenu: false,
            searchResponse: null,
            displayBack:false,
        };
        console.log('initiate done')

    }

    currentLocation() {
        console.log('focus current location')
        navigator.geolocation.getCurrentPosition(function (position) {
            var thelat = position.coords.latitude;
            var thelng = position.coords.longitude;
            this.userLocation = { lat: thelat, lng: thelng }
            this.map.setCenter({ lat: thelat, lng: thelng })
            this.map.setZoom(15)
            if (!this.userMarker) {
                console.log('Set up marker');
                var icon = 'img/baseline-navigation-24px.svg'
                var image = {
                    url: icon,
                    // This marker is 20 pixels wide by 32 pixels high.
                    scaledSize: new window.google.maps.Size(30, 30),
                    // The origin for this image is (0, 0).
                    origin: new window.google.maps.Point(0, 0),
                    // The anchor for this image is the base of the flagpole at (0, 32).
                    anchor: new window.google.maps.Point(0, 32),
                    color:'#ff7504'
                };
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
                this.userMarker = new window.google.maps.Marker({
                    position: { lat: thelat, lng: thelng },
                    map: this.map,
                    icon: image,
                });
                this.userMarker.setMap(this.map)
            }
        }.bind(this));
    }
    renderMap() {
        const google = window.google
        this.map = new google.maps.Map(document.getElementById('MAP'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
            disableDefaultUI: true,
            scaleControl: true,
        });
        console.log('render map done');
        this.currentLocation();
        console.log('set current location done')
        
        this.mainBar.current.setupAutoComplete();
        console.log('set auto complete done')

        window.navigator.geolocation.watchPosition(this.onUpdateLocation.bind(this), this.onLocationErr.bind(this), { enableHighAccuracy: true })
        console.log('set location listener done')

        
    };


    toggleDrawer = (side, open) => () => {
    this.setState({
        [side]: open,
    });
        
    };

    handleScriptLoad() {
        
    }

    handleMobileMenuOpen = event => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
        this.setState({ layerMenu: !this.state.layerMenu });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
        this.setState({ layerMenu: false });
    };

    handleInputSearch = (input) => {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentlocation = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            console.log(currentlocation);
            var request = {
                location: currentlocation,
                radius: '1000',
                query: input
            };
            var service = new window.google.maps.places.PlacesService(this.map);
            service.textSearch(request, this.displaySearchResult.bind(this));
        }.bind(this));
    };

    handleLayer3Click() {
        this.showCrimeRate();
    }

    handleClickAway() {
        if (this.state.layerMenu) {
            this.handleMobileMenuClose();
        }        
    }

    handleBack() {
        console.log('handle back trigered');
        this.setState({ searchResponse: null, displayBack:false })
    }

    handleMyLocationClick() {
        this.focusUser = true;
        this.map.setZoom(17);
        this.map.setCenter(this.userLocation);
        this.currentLocation();
        console.log('my location clicked')
    }

    onUpdateLocation(position) {
        console.log('update location triggered')
        var thelat = position.coords.latitude;
        var thelng = position.coords.longitude;
        this.userLocation = { lat: thelat, lng: thelng }
        if (this.userMarker) {
            console.log('new location')
            this.userMarker.setPosition({lat:thelat,lng:thelng});
        }
        if (this.focusUser) {
            this.map.setCenter({ lat: thelat, lng: thelng })
        }
    }
    onLocationErr(err) {
        console.log(err)
    }

    displaySearchResult = (result) => {
        console.log(result)
        this.setState({ searchResponse: result, displayBack: true })
        this.markers = []

        for (var i = 0; i < result.length;i++) {
            var name = result[i].name;
            var icon = result[i].icon;
            var address = result[i].formatted_address;
            var location = result[i].geometry.location;

            //var image = icon;
            var image = {
                url: icon,
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new window.google.maps.Size(20, 32),
                // The origin for this image is (0, 0).
                origin: new window.google.maps.Point(0,0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new window.google.maps.Point(0, 0)
            };

            var shape = {
                coords: [1, 1, 1, 18, 20, 18, 20, 1],
                type: 'poly'
            };

            var marker = new window.google.maps.Marker({
                position: {lat:location.lat(),lng:location.lng()},
                map: this.map,
                icon: image,
                shape: shape,
                title: name,
                zIndex:1100,
            });
            marker.setMap(this.map)
            this.markers.push(marker);
        }

    };

    displayCrime(map, data) {
        console.log('dixplay crime rate')
        console.log(map);
        console.log(data)
        //This is an example
        //Write your code here to display data on map
        map.data.addGeoJson(data)
        map.data.setStyle(function (feature) {
            console.log('set style')
            console.log(feature)
            console.log(feature.getProperty('crimeRate'))
            if (feature.getProperty('crimeRate') >= 0.01 && feature.getProperty('crimeRate') <= 0.03) {
                console.log('set low')
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.3
                }
            }
            else if (feature.getProperty('crimeRate') > 0.03) {
                console.log('set high')
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.9
                }
            }
        });
    };

    showCrimeRate = () => {
        this.displayCrime(this.map, this.crimeData);
        this.handleMobileMenuClose();
    }

    homePage() {
        console.log('render home page')
        const { classes } = this.props;

        if (document.getElementById('mapdiv').childNodes.length === 0) {
            console.log('download map scripts')
            postscribe('#mapdiv', '<script language="javascript" src=' + this.mapurl + '&libraries=places></script>', {
                done: this.renderMap.bind(this),
            });
        }

        const { mobileMoreAnchorEl, layerMenu } = this.state;
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        var theleft;
        var thetop;
        if (isMobileMenuOpen) {
            var x = mobileMoreAnchorEl.getBoundingClientRect();
            theleft = x.left-125;
        };
        return (
                <div>
                <MainBar
                    toggleDrawer={this.toggleDrawer}
                    handleInputSearch={this.handleInputSearch.bind(this)}
                    innerRef={this.mainBar}
                    displayBack={this.state.displayBack}
                    handleBack={this.handleBack.bind(this)} >
                    </MainBar>
                
                    <div className={classes.layerContainer}>
                    
                        <Fab onClick={this.handleMobileMenuOpen} color="primary" size="small" className={classes.layerIcon}>
                            <LayerIcon />
                        </Fab>
                        
                        {layerMenu ? (
                            <ClickAwayListener onClickAway={this.handleClickAway.bind(this)} onTouchEnd={this.handleClickAway.bind(this)}>
                                <Paper className={classes.layerMenu} style={{ left: theleft, zIndex: 1100 }}>
                                    <MenuItem onClick={this.handleMobileMenuClose} onTouchEnd={this.handleMobileMenuClose}>
                                        <p>Heatmap OFF</p>
                                    </MenuItem>
                                    <MenuItem onClick={this.handleMobileMenuClose} onTouchEnd={this.handleMobileMenuClose}>
                                        <p>Layer1</p>
                                    </MenuItem>
                                    <MenuItem onClick={this.handleMobileMenuClose} onTouchEnd={this.handleMobileMenuClose}>
                                        <p>Layer2</p>
                                    </MenuItem>
                                    <MenuItem onClick={this.handleLayer3Click.bind(this)} onTouchEnd={this.handleLayer3Click.bind(this)}>
                                        <p>Layer3</p>
                                    </MenuItem>
                                </Paper>
                            </ClickAwayListener>
                            ) : null}
                </div>
                <Fab onClick={this.handleMyLocationClick.bind(this)} color="primary" size="small" className={classes.myPositionIcon}>
                    <MyLocationIcon />
                </Fab>
                    {this.state.searchResponse ? (
                        <ResultCard apiKey={this.apiKey} results={this.state.searchResponse}></ResultCard>
                        ) : null}
                </div>
            );
    }

    render() {
    console.log('reander basic app')
    const { classes } = this.props;

    const sideList = (
        <div>
            <List>
                <ListItem button key='Navigation'>
                    <ListItemIcon>
                        <NavigationIon></NavigationIon>
                    </ListItemIcon>
                    <Link to="/Background">Background</Link>
                </ListItem>
                <ListItem button key='Emergency Contacts'>
                    <ListItemIcon>
                        <ContactsIon></ContactsIon>
                    </ListItemIcon>
                    <ListItemText primary='Emergency Contacts' />
                </ListItem>
            </List>
            <Divider />
            <List>
                {['Tracking'].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <MuiThemeProvider theme={theme2}>
            <Router history={history}>
                <SwipeableDrawer
                    open={this.state.left}
                    onClose={this.toggleDrawer('left', false)}
                    onOpen={this.toggleDrawer('left', true)}
                >
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </SwipeableDrawer>
                <div className='mapStyle' id='MAP'>
                </div>
                <Route exact path="/" component={this.homePage.bind(this)} />
                <Route exact path="/Background" component={Background} />
            </Router>  
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
