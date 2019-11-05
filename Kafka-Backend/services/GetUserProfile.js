var Users = require('../models/users');

function handle_request(msg, callback){
    console.log("Inside Get Owner Profile");

    Users.findOne({username: msg.username}, function(err,user){
        if (err) {
            console.log(err);
            console.log("User not found");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to find into the database"});
        } else {
            //console.log("user:", user)
            console.log("User Profile Fetched Successful");
            //res.status(200).json({responseMessage: user});
            callback(null, {status: 200, responseMessage: user});
        } 
    })

}

exports.handle_request = handle_request;