var Users = require('../models/users');

function handle_request(signupData, callback){
    console.log("Inside Update Owner Profile");

    Users.findOneAndUpdate({username:signupData.username}, signupData, (err,user) =>{
        if (err) {
            console.log(err);
            //console.log("Unable to update Database");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Result:", user)
            console.log("Profile update Successful");
            //res.status(200).json({responseMessage: user});
            callback(null, {status: 200, responseMessage: user});
        } 
    })
}

exports.handle_request = handle_request;