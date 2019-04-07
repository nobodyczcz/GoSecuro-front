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
import TurnedInIon from '@material-ui/icons/TurnedIn';

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
import HomePageStepper from './homePageStepper.js';
import ContactsPage from './contactsPage.js'
import PanicButton from './panicButton.js';
import suburbNames from './suburb.json';
import inerSuburbNames from './innerSuburb.json';



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
        marginTop: theme.spacing.unit * 19,
        
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
        top:'calc(100% - 120px)',
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

const theme = createMuiTheme({
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
        light: '#ff8a65',
        main: '#ff7504',
      dark: '#ffa733',
      contrastText: '#000',
      },
    error: {
        main: '#ff8a65',
        contrastText: '#000',
    }
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
        this.directionsService = null;
        this.directionsDisplay = null;

        this.focusUser = true;

        this.markers = null;
        this.service = null;
        this.suburbSet = new Set();

        this.userLocation = null;
        this.heading = null;
        this.basicHeading = 122;
        this.userLocationImage = null;
        this.navRoutes = {
            driving: null,
            walking: null,
            transit: null

        };

        this.navValue = 0;
        this.api = null;

        this.apiKey = 'AIzaSyAFxfzpmKW1-P7LoPmoeTjwoHrNH-Noe_0';
        
        this.mapurl = "https://maps.googleapis.com/maps/api/js?key=" + this.apiKey;

        console.log('create ref')
        this.mainBar = React.createRef();

        console.log('test data')
        this.crimeData = {
            'type': 'FeatureCollection',
            'features': [
                
            ],
        };


        console.log('set state')

        if (document.getElementById('mapdiv').childNodes.length === 0) {
            console.log('download map scripts')
            postscribe('#mapdiv', '<script language="javascript" src=' + this.mapurl + '&libraries=places></script>', {
                done: this.renderMap.bind(this),
            });
        }

        

        this.state = {
            left: false,
            currentPage: 0,
            mobileMoreAnchorEl: null,
            focusUser: false,
            layerMenu: false,
            searchResponse: null,
            displayBack: false,
            displayNavRoutes: false,
            navigating: false,
            currentRoute: null,
        };
        console.log('initiate done')

    }

    componentDidMount() {
        //var suburbs = ["CAULFIELD", "CAULFIELD EAST"];
        var suburbs = inerSuburbNames;
        var data = [];
  

        for (var i in suburbs) {
            if (!this.suburbSet.has(suburbs[i])) {
                data.push(suburbs[i])
                this.suburbSet.add(suburbs[i])
            }

            if (data.length > 30) {
                this.requestCrime(JSON.stringify(data));
                data = []
            }
            
        }
        if (data.length > 0) {
            this.requestCrime(JSON.stringify(data));
        }        

    }
    requestCrime(jsonData) {
        console.log('sendData: ', jsonData);
        fetch('https://gosafe-back20190407071339.azurewebsites.net/Suburbs/Details/', {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                response = JSON.parse(response);
                for (var i in response) {
                    var crime = {
                            'type': 'Feature',
                            'properties': {
                                'crimeRate': 0,
                                'suburb': '',
                                },
                            'geometry': {}
                    }
                    crime.properties.suburb = response[i].suburbname;
                    crime.properties.crimeRate = response[i].crimeRate
                    crime.geometry = JSON.parse(response[i].boundary.replace(/'/g, '"'));
                    this.crimeData.features.push(crime);
                }
                this.handleAllCrime();

            })
            .catch(error => {
                console.log('error')
                console.error('Error:', error)
            });
    }

    handleAllCrime() {
        this.displayAllCrime(this.map, this.crimeData);
        this.handleMobileMenuClose();
        this.handleMobileMenuClose();
    }
    handleHighCrime() {
        this.displayHighCrimeOnly(this.map, this.crimeData);
        this.handleMobileMenuClose();
        this.handleMobileMenuClose();
    }
    handleCrimeOff() {
        this.clearMap(this.map);
        this.handleMobileMenuClose();
    }

    clearMap(map) {
        //Clear all crime rate from map
        map.data.forEach(function (feature) {
            // filter...
            map.data.remove(feature);
        });
    }

    displayAllCrime(map, data) {
        //this.clearMap(map)
        //this.displayColor(map, data)
        //clear previous data on map
        this.clearMap(map)

        //Display high crime places only
        var newdata = {
            'type': 'FeatureCollection',
            'features': []
        };
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].properties.crimeRate > 0) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)

    };

    displayHighCrimeOnly(map, data) {
        //clear previous data on map
        this.clearMap(map)

        //Display high crime places only
        var newdata = {
            'type': 'FeatureCollection',
            'features': []
        };
        console.log(data)
        for (var i = 0; i < data.features.length; i++) {
            if (data.features[i].properties.crimeRate > 0.0769) {
                newdata.features.push(data.features[i]);
            }
        }
        console.log(newdata)

        map.data.addGeoJson(newdata)
        this.displayColor(map, newdata)
    }

    displayColor(map, data) {

        map.data.addGeoJson(data)
        map.data.setStyle(function (feature) {
            // 1st quantile data cr=[0,0.01526)
            if (feature.getProperty('crimeRate') >= 0 && feature.getProperty('crimeRate') <= 0.02526) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.002
                }
            }

            // 2nd quantile data cr=[0.01526,0.02344)
            if (feature.getProperty('crimeRate') >= 0.02526 && feature.getProperty('crimeRate') <= 0.03344) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.05
                }
            }

            // 3rd quantile data cr=[0.02344,0.0323)
            if (feature.getProperty('crimeRate') >= 0.03344 && feature.getProperty('crimeRate') <= 0.0423) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.08
                }
            }
            // 4th quantile data cr=[0.0323,0.0405)
            if (feature.getProperty('crimeRate') >= 0.0423 && feature.getProperty('crimeRate') <= 0.0505) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.12
                }
            }
            // 5th quantile data cr=[0.0405,0.0506)
            if (feature.getProperty('crimeRate') >= 0.0505 && feature.getProperty('crimeRate') <= 0.0606) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.16
                }
            }
            // 6th quantile data cr=[0.0506,0.0625)
            if (feature.getProperty('crimeRate') >= 0.0606 && feature.getProperty('crimeRate') <= 0.0825) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.20
                }
            }
            // 7th quantile data cr=[0.0625,0.0769)
            if (feature.getProperty('crimeRate') >= 0.0825 && feature.getProperty('crimeRate') <= 0.0969) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.22
                }
            }
            // 8th quantile data cr=[0.0769,0.10208)
            if (feature.getProperty('crimeRate') >= 0.0969 && feature.getProperty('crimeRate') <= 0.12208) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.25
                }
            }
            // 9th quantile data cr=[0.10208,0.1529)
            if (feature.getProperty('crimeRate') >= 0.12208 && feature.getProperty('crimeRate') <= 0.1529) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.27
                }
            }
            // 10th quantile data cr=[0.1529,15.5714)
            if (feature.getProperty('crimeRate') >= 0.1529 && feature.getProperty('crimeRate') <= 15.5714) {
                return {
                    strokeOpacity: 0,
                    fillColor: "#ff2600",
                    fillOpacity: 0.3
                }
            }
        })

    }

    currentLocation() {
        //set the current location for first time usage.
        console.log('focus current location')
        navigator.geolocation.getCurrentPosition(function (position) {
            var thelat = position.coords.latitude;
            var thelng = position.coords.longitude;
            if (position.coords.heading) {
                this.heading = position.coords.heading;
            }
            console.log(thelat)
            console.log(thelng)
            console.log(this.heading)
            this.userLocation = { lat: thelat, lng: thelng }
            this.map.setCenter({ lat: thelat, lng: thelng })
            this.map.setZoom(15)
            if (!this.userMarker) {
                console.log('Set up marker');
                this.userLocationImage.rotation = this.heading;
                // Shapes define the clickable region of the icon. The type defines an HTML
                // <area> element 'poly' which traces out a polygon as a series of X,Y points.
                // The final coordinate closes the poly by connecting to the first coordinate.
                this.userMarker = new window.google.maps.Marker({
                    position: { lat: thelat, lng: thelng },
                    map: this.map,
                    icon: this.userLocationImage,
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

        this.userLocationImage = {
            path: 'm4.875098,16.605717c-0.029873,-2.433882 0.634361,-4.022277 1.627162,-5.678671c0.992793,-1.656386 2.932073,-3.720554 4.74924,-4.408087c1.81716,-0.687541 3.921607,-1.167871 6.000649,-0.805492c2.079049,0.36238 5.338262,2.391187 6.88208,4.50682c1.54381,2.115634 3.648258,6.518236 3.552675,8.990873c-0.095591,2.472637 -0.470363,4.422155 -1.946421,6.460716c-1.476058,2.03856 -3.891329,3.333441 -5.87534,3.882768c-1.984019,0.549335 -4.916731,0.058456 -7.001448,-0.884383c-2.084724,-0.942847 -7.953368,-4.693612 -8.669499,-10.903462c-0.716131,-6.209842 -5.777823,8.471585 -4.537555,10.492192c1.240268,2.020599 16.396471,3.800382 11.481619,0.594933c-4.914845,-3.205448 -6.233289,-9.814326 -6.263162,-12.248208z',
            fillColor: '#ff7504',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor:'#ffffff',
            strokeOpacity:1,
            size: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(14, 14),
            rotation: this.basicHeading+this.heading,
        }
        console.log('render map done');
        this.currentLocation();
        console.log('set current location done')
        this.service = new window.google.maps.places.PlacesService(this.map);

        this.directionsService = new window.google.maps.DirectionsService();
        this.directionsDisplay = new window.google.maps.DirectionsRenderer();

        this.mainBar.current.setupAutoComplete();
        console.log('set auto complete done')

        window.navigator.geolocation.watchPosition(this.onUpdateLocation.bind(this), this.onLocationErr.bind(this), { enableHighAccuracy: true })
        console.log('set location listener done')

        this.map.addListener('dragstart', function () {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            this.focusUser = false;
            console.log('focus user off')
        }.bind(this));

        
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

    getLocation() {
        return this.userLocation;
    }

    handleInputSearch = (input) => {

        if (this.service) {
            var currentlocation = this.userLocation;
            var request = {
                location: currentlocation,
                radius: '1000',
                query: input
            };
            this.service.textSearch(request, this.displaySearchResult.bind(this));
        }
        else {
            this.service = new window.google.maps.places.PlacesService(this.map);
            var currentlocation = this.userLocation;
            var request = {
                location: currentlocation,
                radius: '1000',
                query: input
            };
            this.service.textSearch(request, this.displaySearchResult.bind(this));
        }
    };



    handleClickAway() {
        if (this.state.layerMenu) {
            this.handleMobileMenuClose();
        }        
    }

    handleBack() {
        console.log('handle back trigered');
        if (this.state.displayNavRoutes) {
            console.log('cancel navi')
            this.setState({ displayNavRoutes: false, currentRoute:null,currentPage:1 });
            this.navRoutes = {
                driving: null,
                walking: null,
                transit: null
            }
            this.directionsDisplay.setMap(null);
        }
        else {
            this.setState({ searchResponse: null, displayBack: false,currentPage:1 });
            this.clearAllMarkers();
        }
        
    }

    handleMyLocationClick() {
        console.log('my location clicked')
        if (!this.userLocation) {

        }
        else if (this.focusUser) {
            this.map.setZoom(18);
        }
        else {
            this.focusUser = true;
            this.map.setZoom(15);
            this.map.setCenter(this.userLocation);
            this.currentLocation();
            console.log('focus user on')

        }
        
    }

    onUpdateLocation(position) {
        console.log('update location triggered')
        var thelat = position.coords.latitude;
        var thelng = position.coords.longitude;
        if (position.coords.heading) {
            this.heading = position.coords.heading;
            
        }
        console.log('heading:' + this.heading)
        
        this.userLocation = { lat: thelat, lng: thelng }
        
        if (this.userMarker) {
            console.log('update user location')
            
            this.userLocationImage.rotation = this.basicHeading + this.heading;

            this.userMarker.setIcon(this.userLocationImage);

            this.userMarker.setPosition({lat:thelat,lng:thelng});
        }
        if (this.focusUser) {
            this.map.setCenter({ lat: thelat, lng: thelng })
        }
    }
    onLocationErr(err) {
        console.log(err)
    }

    

    clearAllMarkers = () => {
        console.log('clear mark')
        for (var i=0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    };

    displaySearchResult = (result) => {
        console.log(result)
        this.setState({ searchResponse: result, displayBack: true })
        console.log(this.markers)
        if (this.markers) {
            this.clearAllMarkers();
        }
        else {
            this.markers = [];
        }
        

        for (var i = 0; i < result.length;i++) {
            var name = result[i].name;
            var icon = result[i].icon;
            var address = result[i].formatted_address;
            var location = result[i].geometry.location;

            if (i === 0) {
                this.map.setCenter(location);
            }

            //var image = icon;
            var image = {
                url: icon,
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new window.google.maps.Size(30, 30),
                // The origin for this image is (0, 0).
                origin: new window.google.maps.Point(0,0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new window.google.maps.Point(15,15)
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

    navigateTo(location) {

        this.setState({ displayNavRoutes: false });

        var drivingRequest = {
            origin: this.userLocation,
            destination: location,
            travelMode: 'DRIVING',
            transitOptions: {
                departureTime: new Date(Date.now())
            },
        };        
        
        this.directionsService.route(drivingRequest, function (result, status) {
            console.log('get driving: ' + status)
            if (status == 'OK') {
                this.navRoutes.driving = result
                if (!this.state.displayNavRoutes) {
                    this.setState({ displayNavRoutes: true });
                    this.setNavMode('driving');
                }
            }
        }.bind(this));

        var walkRequest = {
            origin: this.userLocation,
            destination: location,
            travelMode: 'WALKING',
            transitOptions: {
                departureTime: new Date(Date.now())
            },
        };

        this.directionsService.route(walkRequest, function (result, status) {
            console.log('get walking: ' + status)
            if (status == 'OK') {
                
                this.navRoutes.walking = result
                if (!this.state.displayNavRoutes) {
                    this.setState({ displayNavRoutes: true });
                    this.setNavMode('walking');
                }
            }
        }.bind(this));

        var transitRequest = {
            origin: this.userLocation,
            destination: location,
            travelMode: 'TRANSIT',
            transitOptions: {
                departureTime: new Date(Date.now())
            },
        };
        this.directionsService.route(transitRequest, function (result, status) {
            console.log('get transit: '+status)
            if (status == 'OK') {
                
                this.navRoutes.transit = result
                if (!this.state.displayNavRoutes) {
                    this.setState({ displayNavRoutes: true });
                    this.setNavMode('transit');
                }
            }
        }.bind(this));
    };

    setNavMode(mode) {
        console.log('set transit mode: '+ mode)
        this.directionsDisplay.setMap(this.map);
        if (mode === 'walking') {
            console.log(this.navRoutes.walking);
            this.navValue=0
            this.setState({ currentRoute: this.navRoutes.walking }, function () { this.directionsDisplay.setDirections(this.state.currentRoute) });
        }
        else if (mode === 'transit') {
            console.log(this.navRoutes.transit)
            this.navValue = 1

            this.setState({ currentRoute: this.navRoutes.transit }, function () { this.directionsDisplay.setDirections(this.state.currentRoute) });
        }
        else if (mode === 'driving') {
            console.log(this.navRoutes.driving)
            this.navValue = 2

            this.setState({ currentRoute: this.navRoutes.driving }, function () { this.directionsDisplay.setDirections(this.state.currentRoute) });
        }
        
        

    };




    theBar = () => {
        return (
            <MainBar
                toggleDrawer={this.toggleDrawer}
                handleInputSearch={this.handleInputSearch.bind(this)}
                innerRef={this.mainBar}
                displayBack={this.state.displayBack}
                handleBack={this.handleBack.bind(this)}
                history={history}
                displayNavRoutes={this.state.displayNavRoutes}
                setNavMode={this.setNavMode.bind(this)}
                tabValue={this.state.currentPage}
                navValue={this.navValue}
            >
            </MainBar>
        );

    };

    homePage() {

        return (
            <div>
                <HomePageStepper />
            </div>
            
            );
    }

    mapPage() {
        console.log('render home page')
        const { classes } = this.props;

        

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
                

                    <div className={classes.layerContainer}>
                    
                        <Fab onClick={this.handleMobileMenuOpen} color="primary" size="small" className={classes.layerIcon}>
                            <LayerIcon />
                        </Fab>
                        
                        {layerMenu ? (
                            <ClickAwayListener onClickAway={this.handleClickAway.bind(this)} onTouchEnd={this.handleClickAway.bind(this)}>
                            <Paper className={classes.layerMenu} style={{ left: theleft, zIndex: 1100 }}>
                                <MenuItem onClick={this.handleCrimeOff.bind(this)} onTouchEnd={this.handleCrimeOff.bind(this)}>
                                        <p>Heatmap OFF</p>
                                    </MenuItem>
                                <MenuItem onClick={this.handleAllCrime.bind(this)} onTouchEnd={this.handleAllCrime.bind(this)}>
                                        <p>Full Heatmap</p>
                                    </MenuItem>
    
                                <MenuItem onClick={this.handleHighCrime.bind(this)} onTouchEnd={this.handleHighCrime.bind(this)}>
                                        <p>High Crime Only</p>
                                    </MenuItem>
                                </Paper>
                            </ClickAwayListener>
                            ) : null}
                </div>
                <Fab onClick={this.handleMyLocationClick.bind(this)} color="primary" size="small" className={classes.myPositionIcon}>
                    <MyLocationIcon />
                </Fab>
                {this.state.searchResponse ? (
                    <ResultCard apiKey={this.apiKey} map={this.map} results={this.state.searchResponse} currentRoute={this.state.currentRoute} navigateTo={this.navigateTo.bind(this)} ></ResultCard>
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
                        <TurnedInIon></TurnedInIon>
                    </ListItemIcon>
                    <Link to="/AboutUs">About Us</Link>
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
        <MuiThemeProvider theme={theme}>
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
                {this.theBar()}
                <PanicButton getLocation={this.getLocation.bind(this)}/>
                <Route exact path="/" component={this.homePage.bind(this)} />
                <Route exact path="/map" component={this.mapPage.bind(this)} />
                <Route exact path="/contacts" component={ContactsPage} />
            </Router>  
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
