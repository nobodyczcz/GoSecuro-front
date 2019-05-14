import $ from 'jquery';
import APIs from './apis.js';
import geolib from 'geolib';


class LocationSharing {
    constructor() {
        this.api = new APIs();
        this.trackCoord=null;
        this.UpdateTime = null;
        this.planArrivalTime=null;
        this.lastDestinationCheck=null;
        this.navigationRoute = null;
        this.journeyId = null;
        this.navigationRoute=null;
        this.currentLat=null;
        this.currentLng=null;
        this.BackgroundGeolocation = window.BackgroundGeolocation;
        this.tracking=false;
        this.checkInteval=600000;
        
    }

    initialize() {
        this.BackgroundGeolocation.configure({
            //locationProvider: this.BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            locationProvider: this.BackgroundGeolocation.ACTIVITY_PROVIDER,
            desiredAccuracy: this.BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 20,
            distanceFilter: 20,
            notificationTitle: 'Gosafe background tracking',
            notificationText: 'enabled',
            debug: false,
            interval: 30000,
            fastestInterval: 15000,
            activitiesInterval: 30000,
        });
        this.BackgroundGeolocation.on('location', function (location) {
            // handle your locations here
            console.log("[INFO] on location update " + location.latitude +" "+ location.longitude)
            var theApi = "api/JTracking/Create";
            this.currentLat = location.latitude;
            this.currentLng = location.longitude;
            var data = {
                JourneyJourneyId: this.getJourneyId(),
                CoordLat: location.latitude,
                CoordLog: location.longitude

            }
            var distance = geolib.getDistance(
                { latitude: this.trackCoord.lat, longitude: this.trackCoord.lng },
                { latitude: location.latitude, longitude: location.longitude }
            );
            var currentTime = Date.now();

            if (distance>=20){
                this.trackCoord = {lat:location.latitude,lng:location.longitude};
                this.updateTime = currentTime
            }
            else{
                var interval = currentTime-this.updateTime;
                if(interval > this.checkInteval){
                    //push notification
                    window.cordova.plugins.notification.local.schedule({
                        title: 'Are you OK?',
                        text: 'You did not move for 10 minutes. Is everything ok?',
                        actions: [
                            { id: 'yes', title: 'Yes' },
                            { id: 'no',  title: 'No' }
                        ]
                    });
                    this.updateTime = currentTime
                }
                
            }

            if ((currentTime-this.lastDestinationCheck>this.checkInteval) && (currentTime > this.planArrivalTime)){
                window.cordova.plugins.notification.local.schedule({
                    title: 'Are you OK?',
                    text: `You should reach desitination by ${Date(this.planArrivalTime)}`,
                    actions: [
                        { id: 'yes', title: 'Yes' },
                        { id: 'no',  title: 'No' }
                    ]
                });
                this.lastDestinationCheck = currentTime;
            }
            
            this.api.callApi(theApi, data, this.uploadSuccess.bind(this), this.uploadError.bind(this))
            // to perform long running operation on iOS
            // you need to create background task
            console.log("[INFO]" + JSON.stringify(data));
            //this.BackgroundGeolocation.startTask(function (taskKey) {
            //    // execute long running task
            //    // eg. ajax post location
            //    // IMPORTANT: task has to be ended by endTask
            //    this.BackgroundGeolocation.endTask(taskKey);
            //}.bind(this));
        }.bind(this));
        this.BackgroundGeolocation.on('error', function (error) {
            console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
        });

        this.BackgroundGeolocation.on('stationary', function(stationaryLocation) {
            // handle stationary locations here

          }.bind(this));

        this.BackgroundGeolocation.on('start', function () {
            console.log('[INFO] BackgroundGeolocation service has been started');

        }.bind(this));

        this.BackgroundGeolocation.on('stop', function () {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
            
        }.bind(this));

        this.BackgroundGeolocation.on('authorization', function (status) {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== this.BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(function () {
                    var showSettings = window.confirm('App requires location tracking permission. Would you like to open app settings?');
                    if (showSettings) {
                        return this.BackgroundGeolocation.showAppSettings();
                    }
                }.bind(this), 1000);
            }
        }.bind(this));

        this.BackgroundGeolocation.on('background', function () {
            console.log('[INFO] App is in background');
            // you can also reconfigure service (changes will be applied immediately)
        }.bind(this));

        this.BackgroundGeolocation.on('foreground', function () {
            console.log('[INFO] App is in foreground');
        }.bind(this));


    }

    uploadSuccess(data) {
        console.log("[INFO]up load LOCATION success")
    }
    uploadError(error) {
        console.log("[ERROR]" + JSON.stringify(error))
    }

    startSuccess(data) {
        console.log("[INFO] tell server start journey success")
        data = JSON.parse(data);
        var reply = JSON.parse(data.data);
        console.log("[INFO]" + data.data);
        console.log("[INFO]" + reply);
        this.journeyId = reply.journeyID;
        this.tempLinkID = reply.tempLinkID;
        this.BackgroundGeolocation.start();
        this.tracking = true;

        
    }

    startError(error) {
        console.log("[ERROR] tell server start journey failed")
        console.log(JSON.stringify(error))
        this.reset()

    }

    stopSuccess(data) {
        console.log("[INFO]tell server Stop journey success")

    }

    stopError(error) {

        console.log("[ERROR] tell server STOP journey failed")

        console.log(JSON.string(error));
    }
    checkStatus(success,fail){        
        this.BackgroundGeolocation.checkStatus(success,fail);
    }


    getNavigationRoute() {
        return this.navigationRoute;
    }

    getJourneyId() {
        return this.journeyId;
    }
    reset(){
        this.trackCoord = null;
        this.updateTime = null;
        this.journeyId = null;
        this.tempLinkID = null;
        this.tracking = false;
        this.lastDestinationCheck=null;
    }

    getCurrentLat() {
        return this.currentLat;
    }

    getCurrentLng() {
        return this.currentLng;
    }

    startTracking(coord,planArrivalTime=null) {
        this.currentLat = coord.lat;
        this.currentLng = coord.lng;
        this.trackCoord = coord;
        this.updateTime = Date.now();
        this.lastDestinationCheck = Date.now();
        if(planArrivalTime){
            this.planArrivalTime = planArrivalTime;
        }
        var theApi = 'api/Journey/create';
        var data = {
            NavigateRoute: this.getNavigationRoute(),
            SCoordLat: this.getCurrentLat(),
            SCoordLog: this.getCurrentLng(),
        }
        console.log("send data:" + JSON.stringify(data));
        this.tracking = true;
        window.cordova.plugins.notification.local.schedule({
            title: 'Navigation Start',
            text: `You are on your way.`,
        });
        this.api.callApi(theApi, data, this.startSuccess.bind(this), this.startError.bind(this))

        
    }

    stopTracking() {
        this.BackgroundGeolocation.stop();
        this.reset()
        var theApi = 'api/Journey/journeyFinish';
        var data = {
            JourneyId: this.getJourneyId(),
            ECoordLat: this.getCurrentLat(),
            ECoordLog: this.getCurrentLng(),
        }
        console.log("[INFO] ask server stop: " + JSON.stringify(data));
        this.api.callApi(theApi, data, this.stopSuccess.bind(this), this.stopError.bind(this))
    }

    isTracking(){
        return this.tracking;
    }






}

export default LocationSharing;