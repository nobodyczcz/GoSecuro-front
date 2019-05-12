import React, { Component } from 'react';
import MainBar from './AppBar';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import RouteDetails from './routeDetail';
import BuddyPage from './BuddyPage';
import PinSurvey from './pinQuestionnaire'; 
import { withStyles } from '@material-ui/core/styles';
import postscribe from 'postscribe';
import { Router, Route, Link } from "react-router-dom";
import LayerIcon from '@material-ui/icons/Layers';
import MyLocationIcon from '@material-ui/icons/MyLocation';

import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { createBrowserHistory, createHashHistory } from 'history';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ResultCard from './searchResult';
import HomePageStepper from './homePageStepper.js';
import ContactsPage from './contactsPage.js';
import EmergencyContacts from './emergencyContactsPage.js';
import AboutUs from './AboutUs.js';
import UserProfile from './UserProfile.js';
import PanicButton from './panicButton.js';
import inerSuburbNames from './innerSuburb.json';
import LightLocation from './LightLocation.json';
import BuddyPage from './BuddyPage.js';
import PinSurvey from './pinQuestionnaire';

import MapController from './mapController.js';
import NavigationPage from './navigation.js'
import APIs from './apis.js';
import LocationSharing from './locationSharing.js';
import Checkbox from '@material-ui/core/Checkbox';

import RegisterPage from './registerPage.js';
import LoginPage from './login.js';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

import LocShareIcon from './locShareIcon';
import DropPin from './dropPin';
import Pin from './pinSvg';


var d3Geo = require("d3-geo")

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
        top:'calc(100% - 220px)',
        display: 'flex',
        zIndex: 1100,
    },
    sharingFab: {
        position: 'absolute',
        left: 'calc(100% - 60px)',
        top: 'calc(100% - 100px)',
        display: 'flex',
        width: '40px',
        height: '40px',
        justifyContent:'center',
        zIndex: 1100,
    },
    dropPin: {
        position: 'absolute',
        left: 'calc(100% - 60px)',
        top: 'calc(100% - 160px)',
        display: 'flex',
        width: '40px',
        height: '40px',
        justifyContent: 'center',
        zIndex: 1100,
    },
    shareIcon:{
        zIndex:3000,
        width:'10px'
    },
    buttonText:{
        fontSize: '10px',
        padding:'0'
    },
    switchButton:{
        padding:'0',
        float:'right'
    },
    menu: {
        display: 'flex',
        zindex:1100,
    },
    layerMenu: {
        position: 'fixed',
        top: theme.spacing.unit * 18,
        left: 'calc( 100% - 150px)',
        width: theme.spacing.unit * 17,
        zIndex:1300
    },
    fullList: {
        width: 'auto',
    },
    panicPosition: {
        position: 'fixed',
        top: 'calc( 100% - 120px)',
        left: 'calc( 50% - 40px)',
        zIndex:1200,
    },
    sideContentBar: {
        marginTop: theme.spacing.unit * 5,
    },
    sideContent: {
        color:'#4f6c98',
        textDecoration:'none'
    },
    legend: {
        position: "absolute",
        top: 'calc( 100% - 100px)',
        width: "30%",
        left:"2%",
        zIndex: 1100,
        borderRadius: "5px",
        opacity: 0.8,
        height:'48px'

    },
    startUpPageLayer: {
        position: 'absolute',
        top:0,
        left:0,
        width: '100%',
        height: '100%',
        zIndex: 1400,
        backgroundColor: "#ffffff"
    },
    welcomeImgContainer:{
        position:'absolute',
        top: '20%',
        left: '5%',
        width: '95%',
        zIndex: 1410,
    },
    welcomeImg:{
        width:'100%',
        top:0,
        left:0,
    },
    friendsBoard: {
        position: 'absolute',
        left: '20px',
        width: '60px',
        zIndex: 1100,
        height:"60%",

    },
    avatar: {
        marginTop: '10px',
        width: "60px",
        height:"60px"
    },
    menuItem: {
        display: 'flex',
        justifyContent: "space-between",
        fontSize: '10px',
        fontWeight: "bold",
        padding:"8px"
    },
    mainBar:{
        height: "400px",
        zIndex: 1000,
        backgroundColor: "#ff7504"

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
            contrastText: '#4f6c98',
            //contrastText: '#ff7504',
            //contrastText: '#616161'
        },
        secondary: {
            light: '#238BC3',
            //main: '#616161',
            main: '#4f6c98',
            //dark :'#424242',
            dark: '#074A8F',
            //  light: '#ff8a65',
            //  main: '#ff7504',
            //dark: '#ffa733',
            contrastText: '#fff',
        },
        error: {
            main: '#ff8a65',
            contrastText: '#000',
        },
        action: {
            light: '#ff8a65',
            main: '#ff7504',
            dark: '#ffa733',
            contrastText: '#fff',
        }
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.apis = new APIs();
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

        //apis to our server
        this.serverApi = new APIs();
        this.locationSharing = new LocationSharing();
        if (window.cordova) {
            this.locationSharing.initialize();
        }
        this.tempLinks = {};
        this.friendPath = null;
        this.friendMarkers = {
            start: null,
            current: null,
            navFinish: null,
            navStart:null,
        }
        this.friendMarkersInfo = {
            startInfo: null,
            currentInfo: null,
            navFinish: null,
            navStart: null,
        }

        /*
        Map related attributes:
        */

        this.mapController = new MapController();

        this.userMarker = null; //current user location marker
        this.directionsService = null;
        this.directionsDisplay = null;

        if (localStorage.crimeTable) {
            this.crimeTable = JSON.parse(localStorage.crimeTable);
        }
        else {
            this.crimeTable = {};
        }

        
        this.focusUser = true;

        this.markers = null;
        this.service = null; // google map places services
        this.suburbSet = new Set();
        this.pinLocation = null;
        this.pins=[
            {
                pinDetails:{ 
                    CoordLog:145.043976,
                    CoordLat:-37.880276,
                    StreetLight:'Low Light',
                    CCTV:'No CCTV Cover the Location',
                    ExperienceType:'Stalked',
                    Experience:'no experience',
                    OtherDetails:null,
                    UserProfileId:null,
                    State:'VIC',
                    Street:'Queens Ave',
                    SuburbSuburbName:'CAULFIELD EAST'
                }
            },
            {
                pinDetails:{
                    CoordLog:145.043262,
                    CoordLat:-37.882431,
                    StreetLight:'Low Light',
                    CCTV:'No CCTV Cover the Location',
                    ExperienceType:'Stalked',
                    Experience:'no experience',
                    OtherDetails:null,
                    UserProfileId:null,
                    State:'VIC',
                    Street:'Queens Ave',
                    SuburbSuburbName:'CAULFIELD EAST'
                }
            }
        ] //dumb data for pins

        this.userLocation = null;
        this.heading = null; // direction of user heading
        this.basicHeading = 122; //The small triangle on user marker do not point north on default, we use this to fix the initial direction of the triangle.
        this.userLocationImage = null;  //The svg image of user location marker
        this.navRoutes = {
            driving: null,
            walking: null,
            transit: null

        }; //Store navigation route at here
        this.routeAnalysis = {
            driving: {},
            walking: {},
            transit: {},
        };
        this.navValue = 0; //dicide which tag (walking driving and publictransport) is activated when jump to navigate page, 
        //api to google's service
        this.api = null;

        this.apiKey = 'AIzaSyAFxfzpmKW1-P7LoPmoeTjwoHrNH-Noe_0';
        
        this.mapurl = "https://maps.googleapis.com/maps/api/js?key=" + this.apiKey;

        /*
        Map related attributes finish
        */

        console.log('create ref')
        this.mainBar = React.createRef();

        this.naviPage = React.createRef();

        console.log('test data')
        this.crimeData = {
            'type': 'FeatureCollection',
            'features': [
                
            ],
        };


        console.log('set state')

        
        if (document.getElementById('mapdiv').childNodes.length === 0) {
            //load map script from server. and render map when script is loaded
            console.log('download map scripts')
            postscribe('#mapdiv', '<script language="javascript" src=' + this.mapurl + '&libraries=places,visualization></script>', {
                done: this.renderMap.bind(this),
            });
        }  

        
        
        this.state = {  // state of react component
            highCrime: false,
            midiumCrime: false,
            displayLight: false,
            displayCameras: false,
            crimeSwitch:true,
            tempLinks:[],
            tracking: false,
            sharing:false,
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
            mapLayer:'all',
            startUpPageLayer: true,
            isLogin: this.serverApi.isLogin(),
            welcomeImgContainer:true,
            error:[],
            barColor: 'secondary',
            hideAppBar:false,
        };
        
        this.interval= null;

        console.log('initiate done')

    }
    /*
     * Constructor finish
     */ 

    

    
     /*
     * app initialize and load data from server
     */
    loginSuccess() {
        this.retrieveTemplinks();
        this.getLinksTimer = setInterval(this.retrieveTemplinks.bind(this), 15000); //retrieve the templink from server eveery 15 s
        this.setState({ isLogin: true });
    }

    loginError(e) {
        clearInterval(this.getLinksTimer);
        history.push('\login');
        console.log(e[1])
    }
    logoutSuccess() {
        this.setState({ isLogin: false });
    }

    handleLogout = () => {
        console.log(window.serverUrl);
        clearInterval(this.getLinksTimer);
        this.apis.logout(this.logoutSuccess.bind(this),this.regError.bind(this))

    }
    retrieveTemplinks = () => {
        if (this.state.isLogin) {
            var theApi = 'api/TempLinks/avaliableLinks'
            var data = null;
            this.apis.callApi(theApi, data, this.receiveLinks.bind(this), this.receiveLinksError.bind(this));
        }

        
        
    }

    updateLocations() {
        if (Object.keys(this.tempLinks).length > 0) {
            console.log("[info]length >0")
            var theApi = 'api/TempLinks/updateLocations'
            var data = []
            for (var key in this.tempLinks) {
                if (this.tempLinks[key].journey) {
                    console.log("[info]request update location")
                    var locations = this.tempLinks[key].locations
                    var theTemp = {
                        TempLinkId: key,
                        lastLocTime: locations.length > 0 ? locations[locations.length - 1].Time : this.tempLinks[key].journey.StartTime
                    }
                    data.push(theTemp)
                }

            }
            if (data.length > 0) {
                console.log("[INFO] request locations")
                this.apis.callApi(theApi, data, this.receiveLocations.bind(this), this.receiveLocationsError.bind(this));

            }
        }
    }

    receiveLocations = (data) => {
        console.log(data)
        for (var key in data) {
            if (data[key].locationListJson != "[]") {
                this.tempLinks[data[key].TempLinkId].locations = this.tempLinks[data[key].TempLinkId].locations.concat(JSON.parse(data[key].locationListJson));
                console.log(this.tempLinks[data[key].TempLinkId].locations)
                if (this.state.friendDisplay == data[key].TempLinkId) {
                    var latlngs = this.convertLocations(JSON.parse(data[key].locationListJson))
                    var path = this.friendPath.getPath()
                    for (var i in latlngs) {
                        path.push(latlngs[i])

                    }
                    this.friendMarkers.current.setPosition(latlngs[latlngs.length-1])

                    
                }

            }
            
        }
        
    }
    receiveLocationsError = (error) => {
        console.log(error)
    }

    receiveLinks = (data) => {
        console.log(data)
        var results = JSON.parse(JSON.parse(data).data);
        var tempLinks = this.tempLinks;
        var linkList=[];
        for (var key in results) {
            linkList.push(results[key].TempLinkId)
        }
        var updated = false;
        for (var key in tempLinks) {
            if (!linkList.includes(key)) {
                if (this.state.friendDisplay == key) {
                    this.handleAvatar(key)
                }
                delete tempLinks[key]
                updated = true;
            }
        }
        for (var key in results) {
            if (!tempLinks[results[key].TempLinkId]) {
                tempLinks[results[key].TempLinkId] = {
                    firstName: results[key].firstName,
                    lastName: results[key].lastName,
                    journey: null,
                    locations:[]
                }
                updated = true; 
                var theApi = "api/Journey/EmergencyRetrieve"
                var data = { TempLinkId: results[key].TempLinkId }
                this.serverApi.callApi(theApi, data, this.getJourneySuccess.bind(this),this.getJourneyError.bind(this))
            }
        }

        this.tempLinks = tempLinks;
        if (updated) {
            console.log("[INFO] temp link list chaged");
            this.setState({ "tempLinks": Object.keys(this.tempLinks) });
        }

        this.updateLocations()
        
    }
    receiveLinksError = (error)=>{
        console.log('[ERROR]'+error)
    }
    getJourneySuccess = (data) => {
        var results = JSON.parse(JSON.parse(data).data);
            
        this.tempLinks[results.TempLinkId].journey = results;
        this.updateLocations()
    }

    getJourneyError = (error) => {
        console.log(error)
    }

    handleAvatar = (e) => {
        //click the round avatar that corresponding the people who are sharing location
        
        var tempLink = e

        if (this.state.friendDisplay == tempLink) {
            //if the one which is displaying clicked, cancel dispaly
            console.log("canceel display")
            this.clearFriendPath()

            this.setState({
                friendDisplay: null
            })
        }
        else {
            //display the route of the one who are clicked
            this.clearFriendPath()

            if (!this.tempLinks[tempLink].journey) {
                setTimeout(function () { this.handleAvatar(e) }.bind(this), 1000);
                return
            }
            console.log("display friend"+e)
            var navRoute = this.tempLinks[tempLink].journey.NavigateRoute
            if (navRoute) {
                var routes = JSON.parse(navRoute);
                this.friendNavPath.setPath(routes.overview_path)
                this.friendNavPath.setMap(this.map)
                this.friendMarkers.navFinish.setPosition(new window.google.maps.LatLng(routes.destination.lat, routes.destination.lng))
                this.friendMarkersInfo.navFinish.setContent("Planed destination");
                this.friendMarkers.navFinish.setMap(this.map);
                //this.friendMarkers.planFinish.setPosition()
            }
            var coords = this.convertLocations(this.tempLinks[tempLink].locations);
            this.friendPath.setPath(coords);
            this.friendPath.setMap(this.map);

            var startlatlng = new window.google.maps.LatLng(this.tempLinks[tempLink].journey.SCoordLat, this.tempLinks[tempLink].journey.SCoordLog)
            this.friendMarkers.start.setPosition(startlatlng)
            this.friendMarkers.start.setMap(this.map)
            this.friendMarkersInfo.startInfo.setContent("Start time: " + this.tempLinks[tempLink].journey.StartTime)

            var length = this.tempLinks[tempLink].locations.length;
            console.log("[INFO]locations list length: "+length)

            if (length) {
                var latlng = new window.google.maps.LatLng(this.tempLinks[tempLink].locations[length - 1].CoordLat, this.tempLinks[tempLink].locations[length - 1].CoordLog)
                this.friendMarkers.current.setPosition(latlng)
                this.friendMarkersInfo.currentInfo.setContent("Current location : " + this.tempLinks[tempLink].locations[this.tempLinks[tempLink].locations.length - 1].Time);
                this.friendMarkers.current.setMap(this.map)
            }

            


            if (coords.length > 0) {
                this.map.setCenter(coords[coords.length - 1]);

            }
            else {
                this.map.setCenter(startlatlng);
            }


            this.setState({
                friendDisplay: tempLink
            })
        }

        
    }

    clearFriendPath() {
        this.directionsDisplay.setMap(null)

        this.friendMarkers.start.setMap(null)
        this.friendMarkers.current.setMap(null)
        this.friendMarkers.navFinish.setMap(null)

        this.friendMarkers.current.setPosition(null)
        this.friendMarkers.start.setPosition(null)
        this.friendMarkers.navFinish.setPosition(null)

        this.friendPath.setPath([]);
        this.friendNavPath.setPath([])

        this.friendPath.setMap(null);
        this.friendNavPath.setMap(null)
    }

    displayTracking(locations) {
        var lastLatLng = null;
        var coords = []
        for (var key in locations) {
            coords.push(new window.google.maps.LatLng(locations[key].CoordLat, locations[key].CoordLog))
        }
        this.friendPath.setPath(coords);
        this.friendPath.setMap(this.map);
        this.map.setCenter(lastLatLng);
    }
    convertLocations(locations) {
        var coords = []
        for (var key in locations) {
            coords.push(new window.google.maps.LatLng(locations[key].CoordLat, locations[key].CoordLog))
        }
        return coords
    }

    componentDidMount() { //start loading crime rate data when this page is rendered
        //var suburbs = ["CAULFIELD", "CAULFIELD EAST"];
        

        this.interval = setTimeout(() => this.setState({ startUpPageLayer: false }), 3000);
        if (!localStorage.userName || !localStorage.password) {
            history.push('\login');
        }
        else {
            var data = {
                grant_type: "password",
                userName: localStorage.userName,
                password: localStorage.password,
            };
            this.serverApi.login(data, this.loginSuccess.bind(this), this.loginError.bind(this))
        }

        if (window.cordova) {
            //try to find crimeRates.json if using cordova
            window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {

                console.log('file system open: ' + fs.name);
                fs.root.getFile("crimeRates.json", { create: false, exclusive: false }, this.successGetCrimeJson.bind(this), this.failedGetCrimeJson.bind(this));

            }.bind(this), this.onErrorLoadFs.bind(this));
        }
        else {
            //directly load from server is using broswer
            this.retrieveCrimeRates()
        }


    }

    successGetCrimeJson(fileEntry) {
        //if crimeRates.json exist. read the file and display them on map
        console.log("crimeRates.json exist: " + fileEntry.isFile.toString());
        
        fileEntry.file(function (file) {
            var reader = new FileReader();
            this.fileReader = reader; //allow call back function access reader object

            reader.onloadend = function () {
                console.log("Successful file read: " + this.fileReader.result);
                this.crimeData = JSON.parse(this.fileReader.result);
                this.displayCrimeRateByLayerSetting();
                

            }.bind(this);

            reader.readAsText(file);

        }.bind(this), this.failedGetCrimeJson.bind(this));
    }
    failedGetCrimeJson(error) {
        //if crimeRates.json doesn't exist, load data from server 
        console.log(JSON.stringify(error))
        console.log("read crimeReates.json failed, load from server")
        this.retrieveCrimeRates()
    }
    onErrorLoadFs(error) {
        //if don't have permission to file system, load from server
        console.log(JSON.stringify(error))
        console.log("Permission failed. read crimeReates.json failed, load from server")
        this.retrieveCrimeRates()
    }



    retrieveCrimeRates() {
        var suburbs = inerSuburbNames;
        var data = [];
        // Request crime rate data. 30 suburbs per http post
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

    componentWillUnmount() {
        clearInterval(this.interval);
    }




    requestCrime(jsonData) {
        //load crime data from server. Display the data one loaded 
        console.log('sendData: '+jsonData);
        fetch(window.serverUrl + 'api/Suburbs/Details/', {
            method: 'POST',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                response = JSON.parse(response);
                var newRateData = {
                    'type': 'FeatureCollection',
                    'features': [

                    ],
                };
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
                    newRateData.features.push(crime);
                    this.crimeTable[response[i].suburbname] = response[i].crimeRate
                }
                if (this.state.midiumCrime && this.state.crimeSwitch) {
                    this.mapController.displayMediumToHighCrime(this.map, this.crimeData);
                }
                else if (this.state.highCrime && this.state.crimeSwitch) {
                    this.mapController.displayHighCrimeOnly(this.map, newRateData);
                }
                else if (this.state.crimeSwitch){
                    this.mapController.displayAllCrime(this.map, newRateData);
                }

                if (this.crimeData.features.length > 415) {
                    localStorage.setItem("crimeTable", JSON.stringify(this.crimeTable));
                    if (window.cordova) {
                        this.saveCrimateRateJson();
                    }
                }

                

            })
            .catch(error => {
                console.log('error')
                console.error('Error:'+ error)
            });
    }

    saveCrimateRateJson() {
        window.requestFileSystem(window.LocalFileSystem.PERSISTENT, 0, function (fs) {

            console.log('file system open: ' + fs.name);
            fs.root.getFile("crimeRates.json", { create: true, exclusive: false }, function (fileEntry) {

                this.writeFile(fileEntry, JSON.stringify(this.crimeData));

            }.bind(this), this.onErrorCreateFile);

        }.bind(this), this.onErrorCreatePermission);
    }

    writeFile(fileEntry, dataObj) {
        // Create a FileWriter object for our FileEntry .
        fileEntry.createWriter(function (fileWriter) {

            fileWriter.onwriteend = function () {
                console.log("Successful file write...");
            };

            fileWriter.onerror = function (e) {
                console.log("Failed file write: " + e.toString());
            };

            // If data object is not passed in,
            // create a new Blob instead.
            if (!dataObj) {
                dataObj = new Blob(['some file data'], { type: 'text/plain' });
            }

            fileWriter.write(dataObj);
        });
    }

    onErrorCreateFile(error) {
        console.log(error.toString())
    }
    onErrorCreatePermission(error) {
        console.log(error.toString())
    }

    /*
     * app initialize and load data from server finish
     */


    /*Map and crime rate visiualization related functions
     * 
     * 
     */
    displayCrimeRateByLayerSetting() {
        if (this.state.mapLayer === 'all') {
            this.handleAllCrime();
        }
        else if (this.state.mapLayer === 'high') {
            this.handleHighCrime();
        }
        else if (this.state.mapLayer === 'off') {
            this.handleCrimeOff();
        }
    }
    handleAllCrime() {
        //Whe user click full heatmap in layer meun. Display all crime rate data on map.
        this.mapController.clearMap(this.map)
        this.mapController.displayAllCrime(this.map, this.crimeData);

        this.handleMobileMenuClose();
        this.setState({ mapLayer: 'all' });
    }
    handleHighCrime() {
        //When user click high crime only on layer meun clear map and display all crime data on the map
        this.mapController.clearMap(this.map)
        this.mapController.displayHighCrimeOnly(this.map, this.crimeData);

        this.handleMobileMenuClose();
        this.setState({ mapLayer: 'high' });

    }
    handleCrimeOff() {
        //When user click crime rate off on layer meun. clear map 
        this.mapController.clearMap(this.map);

        this.handleMobileMenuClose();
        this.setState({ mapLayer: 'off' });

    }
    handleCrimeSwitch() {
        if (!this.state.crimeSwitch) {
            this.mapController.clearMap(this.map);

            if (this.state.highCrime) {
                this.mapController.displayHighCrimeOnly(this.map, this.crimeData);

            }
            else if (this.state.midiumCrime) {
                this.mapController.displayMediumToHighCrime(this.map, this.crimeData);

            }
            else {
                this.mapController.displayAllCrime(this.map, this.crimeData);

            }



            this.handleMobileMenuClose();
            this.setState({ crimeSwitch: !this.state.crimeSwitch });
        }
        else {
            this.mapController.clearMap(this.map)

            this.handleMobileMenuClose();
            this.setState({ crimeSwitch: !this.state.crimeSwitch });
        }
    }
    handleCrimeChange = name => event => {
        if (name == "highCrime") {
            if (event.target.checked && this.state.crimeSwitch) {
                this.mapController.clearMap(this.map)
                this.mapController.displayHighCrimeOnly(this.map, this.crimeData);

            }
            else if (this.state.crimeSwitch){
                this.mapController.clearMap(this.map)
                this.mapController.displayAllCrime(this.map, this.crimeData);
            }
            
            this.setState({ [name]: event.target.checked, "midiumCrime": false });
        }
        else if (name == "midiumCrime") {
            if (event.target.checked && this.state.crimeSwitch) {
                this.mapController.clearMap(this.map)
                this.mapController.displayMediumToHighCrime(this.map, this.crimeData);

            }
            else if (this.state.crimeSwitch) {
                this.mapController.clearMap(this.map)
                this.mapController.displayAllCrime(this.map, this.crimeData);
            }

            this.setState({ [name]: event.target.checked, "highCrime": false });

        }
        else if (name == "displayCameras") {
            if (event.target.checked ) {
                this.mapController.ShowCamera(this.map, this.mapController.cameraLocations)

            }
            else {
                this.mapController.clearCamera()
            }
            this.setState({ [name]: event.target.checked });
        }
        else if (name == "displayLight") {
            if (event.target.checked ) {
                this.mapController.showLight(this.map, LightLocation)

            }
            else {
                this.mapController.clearLight()
            }
            this.setState({ [name]: event.target.checked });
        }
        else if (name == "displayPins") {
            if (event.target.checked ) {
                this.mapController.showPins(this.map, this.pins)

            }
            else {
                this.mapController.clearPins()
            }
            this.setState({ [name]: event.target.checked });
        }
        
    };

    regError(jqXHR) {
        this.state.errors = [];
        var response = jqXHR.responseJSON;
        if (response) {
            if (response.Message) this.state.errors.push(response.Message);
            if (response.ModelState) {
                var modelState = response.ModelState;
                for (var prop in modelState) {
                    if (modelState.hasOwnProperty(prop)) {
                        var msgArr = modelState[prop]; // expect array here
                        if (msgArr.length) {
                            for (var i = 0; i < msgArr.length; ++i) this.state.errors.push(msgArr[i]);
                        }
                    }
                }
            }
            if (response.error) this.state.errors.push(response.error);
            if (response.error_description) this.state.errors.push(response.error_description);
        }
        console.log(this.state.errors)
    }

    /*Map and crime rate visiualization related functions
     * 
     * Finish
     */


    /*Map initialization and user location related functions
     * 
     * 
     */


    
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
        this.startLocImage = {
            path: "M2.5 19h19v2h-19zm19.57-9.36c-.21-.8-1.04-1.28-1.84-1.06L14.92 10l-6.9-6.43-1.93.51 4.14 7.17-4.97 1.33-1.97-1.54-1.45.39 1.82 3.16.77 1.33 1.6-.43 5.31-1.42 4.35-1.16L21 11.49c.81-.23 1.28-1.05 1.07-1.85z",
            fillColor: '#ff7504',
            fillOpacity: 1,
            fillWeight:6,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            strokeOpacity: 1,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(14, 14),
            scale:2
        }
        this.currentLocImage = {
            path: 'M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z',
            fillColor: '#ff7504',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            strokeOpacity: 1,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(14, 14),
            scale:2
        }
        console.log('render map done');
        this.currentLocation(); //Set user location marker and initial location when map loaded.
        console.log('set current location done')

        //initialize places service
        this.service = new window.google.maps.places.PlacesService(this.map);

        //initialize direction service
        this.directionsService = new window.google.maps.DirectionsService();
        this.directionsDisplay = new window.google.maps.DirectionsRenderer();
        this.geoCoder = new window.google.maps.Geocoder()
        this.friendPath = new window.google.maps.Polyline({
            strokeColor: '#43a047',
            strokeOpacity: 1.0,
            strokeWeight: 3
        });

        var lineSymbol = {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 4,
            strokeColor: '#00b0ff',

        };
        this.friendNavPath = new window.google.maps.Polyline({
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
            }],
        });
        this.friendMarkers = {
            start: new window.google.maps.Marker({ icon: this.startLocImage}),
            current: new window.google.maps.Marker({ icon: this.currentLocImage }),
            navStart: new window.google.maps.Marker(),
            navFinish: new window.google.maps.Marker(),
        }
        this.friendMarkersInfo = {
            startInfo: new window.google.maps.InfoWindow(),
            currentInfo: new window.google.maps.InfoWindow(),
            navStart: new window.google.maps.InfoWindow(),
            navFinish: new window.google.maps.InfoWindow()
        }
        this.friendMarkers.start.addListener('click', function () {
            this.friendMarkersInfo.startInfo.open(this.map, this.friendMarkers.start);
        }.bind(this));
        this.friendMarkers.current.addListener('click', function () {
            this.friendMarkersInfo.currentInfo.open(this.map, this.friendMarkers.current);
        }.bind(this));
        this.friendMarkers.navFinish.addListener('click', function () {
            this.friendMarkersInfo.navFinish.open(this.map, this.friendMarkers.navFinish);
        }.bind(this));
        this.friendMarkers.navStart.addListener('click', function () {
            this.friendMarkersInfo.navStart.open(this.map, this.friendMarkers.navStart);
        }.bind(this));


        this.mainBar.current.setupAutoComplete();
        console.log('set auto complete done')

        window.navigator.geolocation.watchPosition(this.onUpdateLocation.bind(this), this.onLocationErr.bind(this), { enableHighAccuracy: true })
        console.log('set location listener done')

        this.map.addListener('dragstart', function () {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            this.focusUser = false;
            console.log('focus user off')
            var input = document.getElementById('searchInput')
            if (input) {
                input.blur();
            }
            this.handleMobileMenuClose()

        }.bind(this));

        this.map.addListener('click', function () {
            // 3 seconds after the center of the map has changed, pan back to the
            // marker.
            this.focusUser = false;
            var input = document.getElementById('searchInput')
            if (input) {
                input.blur();
            }
            this.handleMobileMenuClose()


        }.bind(this));

        
    };

    currentLocation() {
        //set the current location and user marker after user open the app.
        console.log('focus current location')
        if (!this.userMarker && localStorage.lastLocation) {
            this.userLocationImage.rotation = this.basicHeading
            this.userLocation = JSON.parse(localStorage.lastLocation);
            console.log("location cache:" + JSON.parse(localStorage.lastLocation))
            if (!this.userMarker) {
                this.userMarker = new window.google.maps.Marker({
                    position: JSON.parse(localStorage.lastLocation),
                    map: this.map,
                    icon: this.userLocationImage,
                });
                this.userMarker.setMap(this.map)
            }
            
        }
        

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

    getLocation() {
        //return user's current location when required
        return this.userLocation;
    }

    handleMyLocationClick() {
        console.log('my location clicked')
        if (!this.userLocation) {
            this.currentLocation()
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
        //update user location and heading direction.
        console.log('update location triggered')
        var thelat = position.coords.latitude;
        var thelng = position.coords.longitude;
        if (position.coords.heading) {
            this.heading = position.coords.heading;

        }
        console.log('heading:' + this.heading)

        this.userLocation = { lat: thelat, lng: thelng };
        localStorage.setItem( "lastLocation" , JSON.stringify(this.userLocation) )
        if (this.naviPage.current) {
            this.naviPage.current.updateLocation(this.userLocation);
            
        }
        

        if (this.userMarker) {
            console.log('update user location')

            this.userLocationImage.rotation = this.basicHeading + this.heading;

            this.userMarker.setIcon(this.userLocationImage);

            this.userMarker.setPosition({ lat: thelat, lng: thelng });
        }
        if (this.focusUser) {
            this.map.setCenter({ lat: thelat, lng: thelng })
        }
    }
    onLocationErr(err) {
        console.log(err)
    }

    

    /*Map initialization and user location related functions
     * 
     * Finish
     */

    /*Map search related functions
     * 
     * 
     */
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

    clearAllMarkers = () => {
        console.log('clear mark')
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
    };

    displaySearchResult = (result) => {
        if (this.state.currentRoute) {
            this.setState({ currentRoute: null, displayNavRoutes:false }, function () { this.directionsDisplay.setDirections(null) });

        }
        this.mainBar.current.setState({ searching: false });
        console.log(result)
        this.setState({ searchResponse: result, displayBack: true })
        console.log(this.markers)
        if (this.markers) {
            this.clearAllMarkers();
        }
        else {
            this.markers = [];
        }


        for (var i = 0; i < result.length; i++) {
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
                origin: new window.google.maps.Point(0, 0),
                // The anchor for this image is the base of the flagpole at (0, 32).
                anchor: new window.google.maps.Point(15, 15)
            };

            var shape = {
                coords: [1, 1, 1, 18, 20, 18, 20, 1],
                type: 'poly'
            };

            var marker = new window.google.maps.Marker({
                position: { lat: location.lat(), lng: location.lng() },
                map: this.map,
                icon: image,
                shape: shape,
                title: name,
                zIndex: 1100,
            });
            marker.setMap(this.map)
            this.markers.push(marker);
        }

    };

    /*Map search related functions
     * 
     * finish
     */

    /*Map navigation related functions
     * 
     * 
     */

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
            if (status === 'OK') {
                this.navRoutes.driving = result
                this.routeAnalysis.driving.suburbs = this.getSuburbs(result);
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
                this.routeAnalysis.walking.suburbs = this.getSuburbs(result);

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
            console.log('get transit: ' + status)
            if (status === 'OK') {

                this.navRoutes.transit = result
                this.routeAnalysis.transit.suburbs = this.getSuburbs(result);
                if (!this.state.displayNavRoutes) {
                    this.setState({ displayNavRoutes: true });
                    this.setNavMode('transit');
                }
            }
        }.bind(this));
    };

    getSuburbs(route) {

        //analysis the route, get the suburbs that the route pass through
        var path = route.routes[0].overview_path;
        var currentSub = null;
        var suburbs = {
            all:[],
            highCrime:[],
            mediumCrime:[],
            lowCrime:[]
        };
        path.forEach(data => {
            if (currentSub){
                if(d3Geo.geoContains(currentSub,[data.lng(),data.lat()])){
                    return
                }
            }
            this.crimeData.features.forEach(feature=>{
                if (d3Geo.geoContains(feature,[data.lng(),data.lat()])){
                    currentSub = feature;
                    if(!suburbs.all.includes(feature)){
                        suburbs.all.push(feature);
                        if(feature.properties.crimeRate>0.1){
                            suburbs.highCrime.push(feature)
                        }
                        else if(feature.properties.crimeRate>0.0506){
                            suburbs.mediumCrime.push(feature)
                        }
                        else{
                            suburbs.lowCrime.push(feature)
                        }
                    }
                }
            })
        });
        return suburbs;
    }

    

    setNavMode(mode) {
        console.log('set transit mode: ' + mode)
        this.directionsDisplay.setMap(this.map);
        if (mode === 'walking') {
            this.navValue = 0
            this.setState({ currentRoute: this.navRoutes.walking }, this.displayCurrent.bind(this));
        }
        else if (mode === 'transit') {
            this.navValue = 1

            this.setState({ currentRoute: this.navRoutes.transit }, this.displayCurrent.bind(this));
        }
        else if (mode === 'driving') {
            this.navValue = 2

            this.setState({ currentRoute: this.navRoutes.driving }, this.displayCurrent.bind(this));
        }
    };

    displayCurrent() {
        this.directionsDisplay.setDirections(this.state.currentRoute)
        
    }
    /*Map search related functions
     * 
     * finish
     */

    /* The buttons and icons on map page
     * 
     * 
     */ 
    mapPage() {
        this.hideAppBar(false);
        //define the appearance of map 
        console.log('render home page')
        const { classes } = this.props;



        const { mobileMoreAnchorEl, layerMenu } = this.state;
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        var theleft;
        var thetop;
        if (isMobileMenuOpen) {
            var x = mobileMoreAnchorEl.getBoundingClientRect();
            theleft = x.left - 125;
        };
        return (
            <div>


                <div className={classes.layerContainer}>

                    <Fab onClick={this.handleMobileMenuOpen} color="primary" size="small" className={classes.layerIcon}>
                        <LayerIcon />
                    </Fab>
                    {this.state.mapLayer === "off" ? null : <img src="img/legend.png" className={classes.legend}></img>}

                    {this.state.layerMenu ? (
                        <ClickAwayListener onClickAway={this.handleClickAway.bind(this)} >
                            <Paper className={classes.layerMenu}>
                                <MenuItem className={classes.menuItem}>
                                    Crime Rate
                                    <Switch
                                        checked={this.state.crimeSwitch}
                                        onChange={this.handleCrimeSwitch.bind(this)}
                                        value="checkedB"
                                        color="secondary"
                                    />
                                </MenuItem>
                                <MenuItem className={classes.menuItem}>
                                    High only
                                    <Checkbox
                                        checked={this.state.highCrime}
                                        onChange={this.handleCrimeChange('highCrime')}
                                        value="checkedA"
                                        color="secondary"
                                    />
                                </MenuItem>

                                <MenuItem className={classes.menuItem}>
                                    Medium-High
                                    <Checkbox
                                        checked={this.state.midiumCrime}
                                        onChange={this.handleCrimeChange('midiumCrime')}
                                        value="checkedA"
                                        color="secondary"
                                    />
                                </MenuItem>
                                <Divider />

                                <MenuItem className={classes.menuItem}>
                                    Street Light
                                    <Checkbox
                                        checked={this.state.displayLight}
                                        onChange={this.handleCrimeChange('displayLight')}
                                        value="checkedA"
                                        color="secondary"
                                    />
                                </MenuItem>

                                <MenuItem className={classes.menuItem}>
                                    Cameras
                                    <Checkbox
                                        checked={this.state.displayCameras}
                                        onChange={this.handleCrimeChange('displayCameras')}
                                        value="checkedA"
                                        color="secondary"
                                    />
                                </MenuItem>
                                <MenuItem className={classes.menuItem}>
                                    Comments
                                    <Checkbox
                                        checked={this.state.displayPins}
                                        onChange={this.handleCrimeChange('displayPins')}
                                        value="checkedA"
                                        color="secondary"
                                    />
                                </MenuItem>
                            </Paper>
                        </ClickAwayListener>
                    ) : null}
                </div>
                <div className={classes.friendsBoard}>
                    {
                        this.state.tempLinks.map(function (item, index) {

                        var journey = this.tempLinks[item];
                        var fullName = (journey.firstName ? journey.firstName : "") + (journey.lastName ? journey.lastName : "")
                        var displayName = "";
                        if (fullName.length <= 5) {
                            displayName = fullName;
                        }
                        else if (journey.firstName && journey.firstName.length <= 5) {
                            displayName = journey.firstName;
                        }
                        else {
                            displayName = (journey.firstName ? journey.firstName[0] : "") + (journey.lastName ? journey.lastName[0] : "");
                        }

                        if (displayName == "") {
                            displayName = "None"
                        }

                        return (
                                    <Fab className={classes.avatar} color={this.state.friendDisplay == item ? "secondary" : "primary"} key = { item } onClick = { function() { this.handleAvatar(item) }.bind(this)
                            } > { displayName }</Fab>
                            )
                        }.bind(this))
                    }
                </div>

                <Fab onClick={this.handleMyLocationClick.bind(this)} color="primary" size="small" className={classes.myPositionIcon}>
                    <MyLocationIcon />
                </Fab>

                <Fab className={classes.dropPin} color='primary' onClick={this.handleDropPin.bind(this)}>
                    <Pin />

                </Fab> 

                <Fab className={classes.sharingFab} color={this.state.sharing ? 'secondary' :'primary'} onClick={this.handleSwitch('sharing')}>
                    
                    <LocShareIcon
                    />

                </Fab> 
                
                {!this.state.searchResponse ? (
                    <div className={classes.panicPosition}>
                        <PanicButton getLocation={this.getLocation.bind(this)} />

                    </div>
                ) : null
                }

                {this.state.searchResponse ? (
                    <ResultCard routeAnalysis={this.routeAnalysis} alreadyTracking={this.state.tracking} locationSharing={this.locationSharing} crimeTable={this.crimeTable} history={history} apiKey={this.apiKey} map={this.map} getLocation={this.getLocation.bind(this)} results={this.state.searchResponse} currentRoute={this.state.currentRoute} navigateTo={this.navigateTo.bind(this)} ></ResultCard>
                ) : null}
            </div>
        );
    }

    handleMobileMenuClose = () => {
        if (this.state.layerMenu) {
            this.setState({ mobileMoreAnchorEl: null, layerMenu: false });

        }
    };

    handleClickAway() {
        if (this.state.layerMenu) {
            this.handleMobileMenuClose();
        }
    }

    handleMobileMenuOpen = event => {
        console.log(this.state.layerMenu)
        if (this.state.layerMenu) {
            console.log("close")
            this.handleMobileMenuClose();
        }
        else {
            this.setState({ mobileMoreAnchorEl: event.currentTarget, layerMenu: true });
        }
    };

    handleSwitch = name => event => {
        if (name == 'sharing' && window.cordova) {
            if (!this.state[name]) {
                console.log("[INFO]Sharing location on, count 3 seconds")
                this.interval = setTimeout(function() {
                    if (this.state.sharing) {
                        console.log("[INFO]3 seconds reach, switch still on. start sharing.")
                        this.locationSharing.navigationRoute = null;
                        this.locationSharing.startTracking(this.userLocation);
                        this.setState({tracking:true})
                        
                    }
                    else {
                        console.log("[INFO]3 seconds reach, switch OFF.")
                    }
                }.bind(this), 3000);
            }
            else {
                if (this.state.tracking) {
                    this.locationSharing.stopTracking();
                }
            }
            
        }
        console.log("[INFO] sharing state:"+ this.state[name])
        this.setState({ [name]:!this.state[name] });
    };
    /* The buttons and icons on map page
     * 
     * finish
     */


    /*Pin related functions
     * 
     * 
     */
    getPinLocation() {
        return this.pinLocation;
    }

    setPinLocation(pinLocation) {
        this.pinLocation = pinLocation;
    }


    /*Pin related functions
     * 
     * finish
     */
    hideAppBar(hide) {
        if (hide) {
            if (!this.state.hideAppBar) {
                this.setState({ hideAppBar: true })
            }
        }
        else {
            if (this.state.hideAppBar) {
                this.setState({ hideAppBar: false })
                //this.state.hideAppBar=false
            }
        }

    }

    handleDropPin() {
        this.map.setCenter(this.userLocation);
        history.push('/dropPin');
    }


    toggleDrawer = (side, open) => () => {
    this.setState({
        [side]: open,
    });
        
    };

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





    theBar = () => {
        // search and navigate bar

        return (this.state.hideAppBar ? null :
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
                style={this.barColor}
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

    aboutUs() {
        return(
            <div>
                <Typography variant='h6'>
                    <br/>
                    Your safe journey Home is important.
                    <br/>
                    Find your safe way home.
                </Typography>
            </div> 
        );
    }

    startUpPage() {
        return(
            <div className={this.props.classes.startUpPageLayer} >
                <div className={this.props.classes.welcomeImgContainer} >
                    <img src="img/SafeTrip-logo.png" className={this.props.classes.welcomeImg} alt='SafeTrip'/> 
                </div>
            </div>
        );
    }

    

    render() {
        //Basic structure of the whole app
        console.log('reander basic app')
        const { classes } = this.props;

        const sideList = (
            <div>
                <List className={classes.sideContentBar}>
                    <ListItem button key='Navigation'>
                        <Link 
                            className={classes.sideContent}
                            variant='h6'
                            to='/aboutUs'
                        >
                            About Us
                        </Link>
                    </ListItem>
                    <ListItem button key='Navigation2'>
                        <Link 
                            className={classes.sideContent}
                            variant='h6'
                            to='/pinSurvey'
                        >
                            Pin Questionnaire
                        </Link>
                    </ListItem>
                    <Divider/>
                    <ListItem button key='Navigation3'>
                            {this.state.isLogin ?
                                <Link
                                    className={classes.sideContent}
                                    variant='h6'
                                    to='/buddy'
                                >
                                    Buddies
                                </Link>
                                :
                                null
                            }
                        
                    </ListItem>
                    <ListItem button key='Navigation4'>
                            {this.state.isLogin ?
                                <Link
                                    className={classes.sideContent}
                                    variant='h6'
                                    to='/userProfile'
                                >
                                    User Profile
                                </Link>
                                :
                                null
                            }
                        
                    </ListItem>
                    <ListItem button key='Navigation5'>
                        {this.state.isLogin ?
                            <div
                                    className={classes.sideContent}
                                    variant='h6'
                                    onClick={this.handleLogout.bind(this)}
                                >
                                    Logout
                                 </div>
                            :
                            <Link
                                className={classes.sideContent}
                                variant='h6'
                                to='/login'
                            >
                                Login
                        </Link>
                            }
                        
                    </ListItem>
                </List>
            </div>
        );

        return (
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    { this.state.startUpPageLayer ? this.startUpPage() : null }
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
                    <Route exact path="/" component={this.homePage.bind(this)} />
                    <Route exact path="/map" component={this.mapPage.bind(this)} />
                    <Route exact path="/buddy" component={() => <BuddyPage isLogin={this.state.isLogin}/>}  />
                    <Route exact path="/contactsPage" component={() => <ContactsPage isLogin={this.state.isLogin}/>}  />
                    <Route exact path="/register" component={() => <RegisterPage history={history} handleLogin={this.loginSuccess.bind(this)} />} />
                    <Route exact path="/login" component={() => <LoginPage history={history} handleLogin={this.loginSuccess.bind(this)} />} />
                    <Route exact path="/navigation" component={() => <NavigationPage hideAppBar={this.hideAppBar.bind(this)} handleMyLocationClick={this.handleMyLocationClick.bind(this)} innerRef={this.naviPage} getLocation={this.getLocation.bind(this)} locationSharing={this.locationSharing} history={history} currentRoute={this.state.currentRoute} alreadyTracking={this.state.tracking} />} />
                    <Route exact path="/aboutUs" component={AboutUs} />
                    <Route exact path="/pinSurvey" component={()=><PinSurvey getPinLocation={this.getPinLocation.bind(this)}/>} />
                    <Route exact path='/routeDetail' component={()=><RouteDetails hideAppBar={this.hideAppBar.bind(this)} history={history} currentRoute={this.state.currentRoute}/>}/>
                    <Route exact path="/userProfile" component={() => <UserProfile isLogin={this.state.isLogin} history={history} />} />
                    <Route exact path="/emergencyContact" component={() => <EmergencyContacts history={history} handleLogin={this.loginSuccess.bind(this)} isLogin={this.state.isLogin} />} />
                    <Route exact path="/dropPin" component={() => <DropPin setPinLocation={this.setPinLocation.bind(this)} map={this.map} geoCoder={this.geoCoder} hideAppBar={this.hideAppBar.bind(this)} history={history} />} /> 
                </Router>  
          </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(App);
