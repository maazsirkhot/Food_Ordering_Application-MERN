var connection =  new require('./kafka/Connection');
//topics files
//var signin = require('./services/signin.js');
var loginUser = require('./services/loginUser');
var loginOwner = require('./services/loginOwner');
var signupUser = require('./services/signupUser');
var signupOwner = require('./services/signupOwner');
var OwnerProfile = require('./services/OwnerProfile');
var UserProfile = require('./services/UserProfile');
var GetUserProfile = require('./services/GetUserProfile');
var GetOwnerProfile = require('./services/GetOwnerProfile');
var UserDashboard = require('./services/UserDashboard');
var GetMenu = require('./services/GetMenu');
var updateMenu = require('./services/updateMenu');
var Orders = require('./services/Orders');
var getOwnerOrders = require('./services/getOwnerOrders');
var getUserOrders = require('./services/getUserOrders');
var updateStatus = require('./services/updateStatus');
var addMessage = require('./services/addMessage');
var getMessage = require('./services/getMessage');

const mongoose = require('mongoose');
const db = require('./helpers/settings').mongoURI;
var passport = require('passport');
var jwt = require('jsonwebtoken');


mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 100 }) // Let us remove that nasty deprecation warrning :)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('Server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("loginUser",loginUser);
handleTopicRequest("loginOwner",loginOwner);
handleTopicRequest("SignUpUser",signupUser);
handleTopicRequest("SignUpOwner",signupOwner);
handleTopicRequest("OwnerProfile",OwnerProfile);
handleTopicRequest("UserProfile",UserProfile);
handleTopicRequest("GetUserProfile",GetUserProfile);
handleTopicRequest("GetOwnerProfile",GetOwnerProfile);
handleTopicRequest("UserDashboard",UserDashboard);
handleTopicRequest("GetMenu",GetMenu);
handleTopicRequest("updateMenu",updateMenu);
handleTopicRequest("Orders",Orders);
handleTopicRequest("getOwnerOrders",getOwnerOrders);
handleTopicRequest("getUserOrders",getUserOrders);
handleTopicRequest("updateStatus",updateStatus);
handleTopicRequest("addMessage",addMessage);
handleTopicRequest("getMessage",getMessage);