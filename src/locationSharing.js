import $ from 'jquery';
import APIs from './apis.js';


class LocationSharing {
    constructor() {
        this.api = new APIs();
        this.BackgroundGeolocation = window.BackgroundGeolocation;
        this.BackgroundGeolocation.configure({
            locationProvider: this.BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: this.BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 20,
            distanceFilter: 20,
            notificationTitle: 'Gosafe background tracking',
            notificationText: 'enabled',
            debug: true,
           
            url: 'http://192.168.81.15:3000/location',
            httpHeaders: {
                'X-FOO': 'bar'
            },
            // customize post properties
            postTemplate: {
                lat: '@latitude',
                lon: '@longitude',
                foo: 'bar' // you can also add your own properties
            }
        });
        this.BackgroundGeolocation.on('location', function (location) {
            // handle your locations here
            // to perform long running operation on iOS
            // you need to create background task
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
        });

        this.BackgroundGeolocation.on('stop', function () {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        this.BackgroundGeolocation.on('authorization', function (status) {
            console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
            if (status !== this.BackgroundGeolocation.AUTHORIZED) {
                // we need to set delay or otherwise alert may not be shown
                setTimeout(function () {
                    var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
                    if (showSetting) {
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






}

export default LocationSharing;