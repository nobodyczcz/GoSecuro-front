import $ from 'jquery';
import APIs from './apis.js';
import geolib from 'geolib';
import { timeout } from 'q';


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
        this.checkInteval=60000;
        this.checkStationary=false;
        
    }

    initialize() {
        this.BackgroundGeolocation.configure({
            //locationProvider: this.BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            locationProvider: this.BackgroundGeolocation.ACTIVITY_PROVIDER,
            desiredAccuracy: this.BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 20,
            distanceFilter: 20,
            notificationTitle: 'GoSecuro background tracking',
            notificationText: 'enabled',
            debug: true,
            interval: 30000,
            fastestInterval: 15000,
            activitiesInterval: 20000,
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

            var distance = geolib.getDistance(
                { latitude: this.trackCoord.lat, longitude: this.trackCoord.lng },
                { latitude: location.latitude, longitude: location.longitude }
            );
            var currentTime = Date.now();

            if(this.navigationRoute){
                if (distance>=20){
                    this.trackCoord = {lat:location.latitude,lng:location.longitude};
                    this.updateTime = currentTime
                }
                else{
                    var interval = currentTime-this.updateTime;
                    if(interval > this.checkInteval){
                        //push notification
                        this.triggerCheck({ latitude: this.trackCoord.lat, longitude: this.trackCoord.lng })
                        this.updateTime = currentTime
                    }
                    
                }
    
                if (((currentTime-this.lastDestinationCheck)>this.checkInteval) && ((currentTime - this.planArrivalTime)>this.checkInteval)){
                    //trigger check arrival late
                    window.cordova.plugins.notification.local.schedule({
                        title: `You should reach desitination by ${new Date(this.planArrivalTime).toLocaleTimeString()}`,
                        text:  `Is everything OK?`,
                        actions: [
                            { id: 'late-yes', title: 'Yes' },
                            { id: 'late-no',  title: 'No' }
                        ]
                    });
                    this.doubleCheck('late')
                    window.cordova.plugins.notification.local.on('late-yes', this.staCheckCallBack, this);
                    window.cordova.plugins.notification.local.on('late-no', this.staCheckCallBack, this);
                    this.checkLate=true;
                    this.lastDestinationCheck = currentTime;
                }
            }
            
            
            // to perform long running operation on iOS
            // you need to create background task
            console.log("[INFO] send to server" + JSON.stringify(data));
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

        this.BackgroundGeolocation.on('stationary', function(location) {
            console.log("[INFO] device on stationary")
            if(this.navigationRoute){
                this.stationaryCheckUser(location)
            }
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
            console.log(`[INFO] ${JSON.stringify(window.cordova.plugins.notification.local.launchDetails)}`);
                if(this.checkStationary){
                    navigator.notification.confirm(
                        `You haven't been moving for ${this.checkInteval/1000/60} minutes. Is everything ok?`, // message
                        (index)=>{this.onStaAlertReply(index,'stationary')},            // callback to invoke with index of button pressed
                        'Is everything alright?',           // title
                        ["Yes, I'm fine",'No, contact my friends']     // buttonLabels
                    );
                }
                if(this.checkLate){
                    navigator.notification.confirm(
                        `You should reach desitination by ${new Date(this.planArrivalTime).toLocaleTimeString()}`, // message
                         (index)=>{this.onStaAlertReply(index,'late')},            // callback to invoke with index of button pressed
                        'Is everything alright?',           // title
                        ["Yes, I'm fine",'No, contact my friends']     // buttonLabels
                    );
                }
        }.bind(this));


    }

    staCheckCallBack(notification, eopts){
        //{"event":"staCheckNo","foreground":false,"queued":false,"notification":0}"
        console.log('[INFO] sta callback '+JSON.stringify(notification))
        console.log('[INFO] sta callback '+JSON.stringify(eopts))
        if(eopts.event === 'staCheckYes'){

            this.checkStationary=false;
        }

        if(eopts.event === 'staCheckNo'){

            this.checkStationary=false;
            this.api.triggerEmergency({lat:this.currentLat,lng:this.currentLng});


        }
        if(eopts.event === 'late-yes'){

            this.checkLate=false;

        }
        if(eopts.event === 'late-no'){

            this.checkLate=false;
            this.api.triggerEmergency({lat:this.currentLat,lng:this.currentLng});

        }
        

    }

    onStaAlertReply(index,name){
        console.log('[INFO] get reply: '+ index)
        if(index ===1){
            //nothing
        }
        else{
            //contact emergency
            this.api.triggerEmergency({lat:this.currentLat,lng:this.currentLng});

        }

        if(name === 'late'){
            this.checkLate=false
        }
        else if(name === 'stationary' ){
            this.checkStationary=false;
        }
    }

    stationaryCheckUser(location){
        if (this.checkStationary){
            return
        }
        this.BackgroundGeolocation.startTask(function (taskKey) {
            console.log("[INFO] device on stationary: set time out")
            setTimeout(()=>{
                console.log('[INFO] stationary Time out')
                console.log(`latitude: ${location.latitude}, longitude: ${location.longitude}`)
                console.log(`latitude: ${this.currentLat.lat}, longitude: ${this.currentLng.lng}`)

                this.triggerCheck(location,taskKey)
                
            },this.checkInteval);
           
        }.bind(this));

    }
    triggerCheck(location,taskKey=null){
        var distance = geolib.getDistance(
            { latitude: this.currentLat, longitude: this.currentLng },
            { latitude: location.latitude, longitude: location.longitude }
        );
        console.log('[INFO] stationary Time out: distance '+ distance)
        if (distance<=20){
            this.checkStationary = true;
            window.cordova.plugins.notification.local.schedule({
                title: `You haven't been moving for ${this.checkInteval/1000/60} minutes.`,
                text:'Is everything alright?',
                foreground:true,
                priority: 1,
                autoClear:false,
                vibrate:true,
                lockscreen:true,
                sound:true,
                channel:'default-channel-id',
                actions: [
                    { id: 'staCheckYes', title: "Yes, I'm fine" },
                    { id: 'staCheckNo',  title: 'No, contact my friends' }
                ]
            });

           
            this.doubleCheck('stationary',taskKey)
            window.cordova.plugins.notification.local.on('staCheckYes', this.staCheckCallBack, this);
            window.cordova.plugins.notification.local.on('staCheckNo', this.staCheckCallBack, this);

        }
    }
    doubleCheck(name,taskKey=null){
        setTimeout(()=>{

            if(name==='stationary' && this.checkStationary){
                window.cordova.plugins.notification.local.schedule({
                    title: "You haven't responded to the system,  the alert messages have now been already sent to your emergency contacts.",
                    foreground:true,
                    vibrate:true,
                    priority: 1,
                    sound:true,
                    channel:'Default channel',
                });
                
                this.checkStationary = false;
                this.api.triggerEmergency({lat:this.currentLat,lng:this.currentLng});

                //notify emergency contacts
            }
            else if(name==='late' && this.checkLate){
                window.cordova.plugins.notification.local.schedule({
                    title: "You haven't responded to the system,  the alert messages have now been already sent to your emergency contacts.",
                    foreground:true,
                    vibrate:true,
                    priority: 1,
                    sound:true,
                });
                this.checkLate = false;
                this.api.triggerEmergency({lat:this.currentLat,lng:this.currentLng});

                //notify emergency contacts
            }

            if(taskKey){
                this.BackgroundGeolocation.endTask(taskKey);
            }
        },this.checkInteval/2)
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
        this.navigationRoute=null;
        this.trackCoord = null;
        this.updateTime = null;
        this.journeyId = null;
        this.tempLinkID = null;
        this.tracking = false;
        this.lastDestinationCheck=null;
        this.checkStationary=false;
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
        this.reset()

    }

    isTracking(){
        return this.tracking;
    }






}

export default LocationSharing;