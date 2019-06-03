import $ from 'jquery';


class APIs {
    constructor() {
        this.url = window.serverUrl;
        this.tokenKey = 'accessToken';
        this.userName = null;
        this.password = null;
        
        


    }

    setToken(token) {
        sessionStorage.setItem(this.tokenKey, token);
    }

    isLogin() {
        if (sessionStorage.getItem(this.tokenKey)) {
            return true;
        }
        else {
            return false;
        }
    }

    callApi(api, data, success, error) {
        //call the api with data
        //api : the route to api
        //data : json data you want to pass to server
        //success : success call back function that take error as argument
        //error : error call back function that take error as argument

            var token = sessionStorage.getItem(this.tokenKey);
            var headers = {};
            if (token) {
                headers.Authorization = 'Bearer ' + token;
            }

            $.ajax({
                type: 'POST',
                url: this.url + api,
                contentType: 'application/json; charset=utf-8',
                headers: headers,
                data: JSON.stringify(data)
            }).done(success).fail(error);
    
    }


    register(regdata,success,error) {

        console.log(JSON.stringify(regdata))
        $.ajax({
            type: 'POST',
            url: this.url+'api/Account/Register',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(regdata)
        }).done(
            success
            ).fail(error
            );
    }

    

    login(loginData,success,error) {
        this.userName = loginData.userName;
        this.password = loginData.password;
        $.ajax({
            type: 'POST',
            url: this.url+'/Token',
            data: loginData
        }).done(function (data) {
            // Cache the access token in session storage.
            this.setToken(data.access_token);
            localStorage.setItem("userName", this.userName);
            localStorage.setItem("password", this.password);
            success(data);
            }.bind(this)).fail(error);
    }

    logout(success,error) {
        // Log out from the taken based logon.
        var token = sessionStorage.getItem(this.tokenKey);
        var headers = {};
        if (token) {
            headers.Authorization = 'Bearer ' + token;
        }
        console.log("logout the Token:"+token)
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        sessionStorage.removeItem(this.tokenKey);
        success();
        $.ajax({
            type: 'POST',
            url: this.url+'api/Account/Logout',
            headers: headers
        }).done(function (data) {
            // Successfully logged out. Delete the token.


        }.bind(this)).fail(error);
    }

    initializeUserData(mapController){
        this.mapController = mapController;
        var apiRoute = 'api/UserEmergency/retrieveEmergencies';
        this.callApi(apiRoute,'',this.retrieveEmSuccess.bind(this),(err)=>{console.log(err)});

        var apiRoute2 = 'api/UserProfiles/Retrieve';
        this.callApi(apiRoute2, '', this.retrievePoSuccess.bind(this), (err)=>{console.log(err)});

        if(window.cordova){
            console.log('set push')
                this.push= window.PushNotification.init({
                    android: {
                    },
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                });
                this.push.on('registration', (data) => {
                    console.log('registration done')

                    console.log(data.registrationId);
                    var api='api/UserProfiles/setFcmId';
                    this.callApi(api,[data.registrationId],()=>{console.log('[INFO]FcmId set success')},(error)=>{console.log(error)})
                });
                this.push.on('notification', (data) => {
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                    window.addErgentList(data.additionalData);
                    navigator.notification.confirm(
                        `You might want to call them to make sure they are alright`, // message
                        ()=>{},
                        "Your friend " + data.additionalData.Name + " might need help",// title
                        'Check his location'           
                    );
                    console.log('[INFO] on motification '+ data.title)
                });
                
                this.push.on('error', (e) => {
                    console.log('[INFO] push error')
                    console.log(e.message)
                });
        }


    }

    retrieveEmSuccess(reply) {
        localStorage.setItem("localContactList", JSON.parse(reply).data);
    }
    retrievePoSuccess(reply){
        console.log(reply.data)
        localStorage.setItem("profile",reply.data);
    }

    triggerEmergency(location){
        console.log("On cordova emergency")
        var contList
        if(this.isLogin){
            contList = JSON.parse(localStorage.localContactList);
        }
        else{
            contList = JSON.parse(localStorage.contactList);
        }
            
            var lat = location.lat;
            var lng = location.lng;

            var data = [location.lat,location.lng] 

                var api = 'api/UserEmergency/emergency/';
            if(this.isLogin){
                this.callApi(api,data,()=>{console.log('[INFO] emergency api success')},(err)=>{console.log('[INFO] emergency api error: '+err)})
            }

            for (var i in contList) {
                console.log('send Message to ',contList[i].ECname)
                var name = contList[i].ECname;
                var userName
                if(localStorage.profile){
                    var profile = JSON.parse(localStorage.profile)
                    userName = profile.FirstName?profile.FirstName:"" + profile.LastName?' '+profile.LastName:'';
                }
                else{
                    userName='';
                }
                
                var googleLink = 'https://www.google.com/maps/search/?api=1&query='+lat+','+lng
                var string = "Hi " + name + ", \nYour friend " + userName + " is in trouble at the moment.\nThis is their last current location " + googleLink + ".\nYou might want to call them to make sure they are alright..\nThanks. \n(Sent automatically by GoSecuro) ";

                

                
                var options = {
                    replaceLineBreaks: false, // true to replace \n by a new line, false by default
                    android: {
                        intent: '' // send SMS without opening any other app
                    }
                };
            
                var success = function () { window.handleShowNoti('Message Send Successful') };
                var error = function (e) { window.handleShowNoti('Message Failed:' + e) };
                if(window.cordova){
                    window.sms.send(contList[i].EmergencyContactPhone, string, options, success, error);
                }
        }
            if(window.cordova){
                navigator.notification.confirm(
                    `Panic Button triggerd! Emergency messages and your location have been sent to your Emergency contacts!`, // message
                    ()=>{},
                    'Emergency!',
                    'Done'           // title
                );
            }
           
    }
    

}

export default APIs;