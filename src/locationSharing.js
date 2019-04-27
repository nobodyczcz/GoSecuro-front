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
            this.currentLat = location.latitude;
            this.currentLng = location.longitude;
            var data = {
                JourneyJourneyId: this.journeyId,
                CoordLat: location.latitude,
                CoordLog: location.longitude

            }

            // to perform long running operation on iOS
            // you need to create background task
            console.log(JSON.stringify(location));
            this.BackgroundGeolocation.startTask(function (taskKey) {
                // execute long running task
                // eg. ajax post location
                // IMPORTANT: task has to be ended by endTask
                this.BackgroundGeolocation.endTask(taskKey);
            }.bind(this));
        }.bind(this));
        this.BackgroundGeolocation.on('error', function (error) {
            console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
        });

        this.BackgroundGeolocation.on('start', function () {
            console.log('[INFO] BackgroundGeolocation service has been started');
            var theApi = 'api/Journey/create';
            var data = {
                NavigateRoute: this.getNavigationRoute(),
                SCoordLat: this.getCurrentLat(),
                SCoordLog: this.getCurrentLng(),
            }
            this.api.callApi(theApi, JSON.stringify(data), this.startSuccess.bind(this), this.startError.bind(this))
        }.bind(this));

        this.BackgroundGeolocation.on('stop', function () {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
            var theApi = 'api/Journey/journeyFinish';
            var data = {
                JourneyId: this.getJourneyId(),
                ECoordLat: this.getCurrentLat(),
                ECoordLog: this.getCurrentLng(),
            }
            this.api.callApi(theApi, JSON.stringify(data), this.startSuccess.bind(this), this.startError.bind(this))
        });

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

    startSuccess(data) {
        console.log(data)
        this.journeyId = data.data.journeyId;
        this.tempLinkID = data.data.tempLinkID;
    }

    startError(error) {
        console.log(JSON.string(error))
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
        return this.CurrentLng;
    }

    startTracking(coord) {
        this.currentLat = coord.lat;
        this.currentLng = coord.lng;
        this.BackgroundGeolocation.start();
    }

    stopTracking() {
        this.BackgroundGeolocation.stop();
    }






}

export default LocationSharing;