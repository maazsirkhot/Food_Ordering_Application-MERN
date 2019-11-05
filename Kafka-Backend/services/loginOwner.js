var encrypt = require('../helpers/passwordEncryption');
var Owners = require('../models/owners');

function handle_request(msg, callback){
    console.log("Inside Login User Service");
    Owners.findOne({email : msg.email}, (err, user) => {
        if (err){
            console.log(err);
            callback(err, "Unable to read the database")
        } else {
            if(user) {
                console.log(user);
                encrypt.compareHash(msg.password, user.password, function(err, isMatch){
                    if (isMatch && !err) {
                        console.log("Owner Login Successful");
                        callback(null, {responseMessage: user, status : 200});

                    } else {
                        console.log("Authentication failed. Passwords did not match");
                        callback(null, {status : 401});
                    }

                }, function (err) {
                    console.log(err);
                    callback(null, {status : 401});
                });
            } else {
                console.log("User does not exist");
                callback(null, {status : 401});
            }

        }
    })
}

exports.handle_request = handle_request;