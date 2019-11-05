var Owners = require('../models/owners');

function handle_request(msg, callback){
    console.log("Inside Get Owner Profile");

    Owners.findOne({email: msg.email}, function(err,user){
        if (err) {
            console.log(err);
            console.log("User not found");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            //console.log("user:", user)
            console.log("Owner Profile Fetched Successful");
            //res.status(200).json({responseMessage: user});
            callback(null, {status: 200, responseMessage: user});
        } 
    })

}

exports.handle_request = handle_request;