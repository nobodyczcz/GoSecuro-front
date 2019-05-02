import $ from 'jquery';
import APIs from './apis.js';


class LocationSharing {
    constructor() {
        this.api = new APIs();
        this.navigationRoute = null;
        this.journeyId = null;
        this.navigationRoute=null;
        this.currentLat=null;
        this.currentLng=null;
        this.BackgroundGeolocation = window.BackgroundGeolocation;
        
    }

    initialize() {
        this.BackgroundGeolocation.configure({
            locationProvider: this.BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: this.BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 20,
            distanceFilter: 20,
            notificationTitle: 'Gosafe background tracking',
            notificationText: 'enabled',
            debug: true,
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
            this.BackgroundGeolocation.configure({ debug: true });
        }.bind(this));

        this.BackgroundGeolocation.on('foreground', function () {
            console.log('[INFO] App is in foreground');
        }.bind(this));

        this.BackgroundGeolocation.checkStatus(function (status) {
            console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
            console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
            console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

            // you don't need to check status before start (this is just the example)
        });
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
        
    }

    startError(error) {
        console.log("[ERROR] tell server start journey failed")
        console.log(JSON.stringify(error))
    }

    stopSuccess(data) {
        console.log("[INFO]Stop success")
        this.journeyId = null;
        this.tempLinkID = null;
    }

    stopError(error) {
        console.log("[ERROR] tell server STOP journey failed")

        console.log(JSON.string(error));
        this.journeyId = null;
        this.tempLinkID = null;
    }


    getNavigationRoute() {
        return this.navigationRoute;
    }

    getJourneyId() {
        return this.journeyId;
    }

    getCurrentLat() {
        return this.currentLat;
    }

    getCurrentLng() {
        return this.currentLng;
    }

    startTracking(coord) {
        this.currentLat = coord.lat;
        this.currentLng = coord.lng;
        var theApi = 'api/Journey/create';
        var data = {
            NavigateRoute: this.getNavigationRoute(),
            SCoordLat: this.getCurrentLat(),
            SCoordLog: this.getCurrentLng(),
        }
        console.log("send data:" + JSON.stringify(data));
        this.api.callApi(theApi, data, this.startSuccess.bind(this), this.startError.bind(this))

        
    }

    stopTracking() {
        this.BackgroundGeolocation.stop();
        var theApi = 'api/Journey/journeyFinish';
        var data = {
            JourneyId: this.getJourneyId(),
            ECoordLat: this.getCurrentLat(),
            ECoordLog: this.getCurrentLng(),
        }
        console.log("[INFO] ask server stop: " + JSON.stringify(data));
        this.api.callApi(theApi, data, this.stopSuccess.bind(this), this.stopError.bind(this))
    }






}

export default LocationSharing;