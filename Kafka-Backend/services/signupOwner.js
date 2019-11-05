var encrypt = require('../helpers/passwordEncryption');
var Owners = require('../models/owners');

function handle_request(msg, callback){
    console.log("Inside Signup Owner Service");

    Owners.findOne({email : msg.signupData.email}, (err, rows) => {
        if (err){
            console.log(err);
            console.log("unable to read the database");
            //res.status(401).send({responseMessage: err});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            if(rows){
                console.log("Owner already exists");
                //res.status(401).send({responseMessage: "User already exists"});
                callback(null, {status: 401, responseMessage: "Owner already exists"})
            } else {
                encrypt.createHash(msg.encryptPass, function (response){
                    msg.signupData.password = response;
                    console.log("Encrypted Password is: " + msg.signupData.password);
                    
                    Owners.create(msg.signupData, function (err,user) {
                        if (err) {
                            console.log("unable to insert into database", err);
                            //res.status(401).send({responseMessage: err});
                            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
                        } else {
                            console.log("User added");
                            //res.status(200).send({responseMessage: user})
                            callback(null, {status: 200, responseMessage: user});
                        }
                    });
                }, function (err) {
                    console.log(err);
                    callback(err, {status: 401, responseMessage: "unable to insert into the database"});
                });
            }
            
        }
    })
}

exports.handle_request = handle_request;