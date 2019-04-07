var TelstraMessaging;
TelstraMessaging = require('Telstra_Messaging');
console.log('ready to start telstra messaging')
var api;
api = new TelstraMessaging.AuthenticationApi()
var clientId;
clientId= "ok0BXBxHG0NWUyorDxMk7YSQNmBZVyGL"; // {String} 
var clientSecret;
clientSecret= "LEuBLSXuoGJCWViy"; // {String} 
var grantType;
grantType = "client_credentials"; // {String} 
var OAuthResponse;
var defaultClient;
defaultClient = TelstraMessaging.ApiClient.instance;
var auth;
auth = defaultClient.authentications['auth'];
var apiInstance;
var sendSMSRequest; 

var callback = function (error, data, response) {
    if (error) {
        console.log('Auth failed')
        
        console.error(error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
        OAuthResponse = data;
        auth.accessToken = data.accessToken;
        console.log('set token done');
        apiInstance = new TelstraMessaging.MessagingApi();
        console.log('set apiinstance done')

        sendSMSRequest = new TelstraMessaging.SendSMSRequest(); 
        console.log('set sendSMSRequest done')



    }
};
console.log('Perform auth')
api.authToken(clientId, clientSecret, grantType, callback);

// Configure OAuth2 access token for authorization: auth



