var encrypt = require('../helpers/passwordEncryption');
var Users = require('../models/users');

function handle_request(msg, callback){
    console.log("Inside Login User Service");
    Users.findOne({username : msg.username}, (err, user) => {
        if (err){
            console.log(err);
            console.log("unable to read the database");
            //res.status(401).send({responseMessage: err});
            callback(err, "unable to read the database")
        } else {
            if(user) {
                console.log(user);
                encrypt.compareHash(msg.password, user.password, function(err, isMatch){
                    if (isMatch && !err) {
                        console.log("User Login Successful");
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
                //res.status(401).send({responseMessage: 'User does not exist'});
                callback(null, {status : 401});
            }

        }
    })
}

exports.handle_request = handle_request;