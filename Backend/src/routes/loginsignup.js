var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var encrypt = require('../helpers/passwordEncryption');
var Users = require('../models/users');
var Owners = require('../models/owners');
var jwt = require('jsonwebtoken');
var kafka = require('../../Kafka/client');

router.route('/SignUpUser').post(function(req, res){
    var encryptPass = req.body.password;
    console.log("SignUp User");
    var signupData = {
        "name": req.body.name,
        "username": req.body.username,
        "password": ""
    }
    var msg = {
        signupData : signupData,
        encryptPass : encryptPass
    }

    kafka.make_request('SignUpUser', msg, function(err,results){
        console.log('Sending request to Kafka');

        if(err){
            console.log(err);
            res.status(401).send({responseMessage : results.responseMessage});
        } else {
            if(results.status == 401){
                console.log("Status 401 Occurred. Please try again");
                res.status(401).send({responseMessage : results.responseMessage});
            } else{
                console.log("Process successful");
                res.status(200).send({responseMessage : results.responseMessage});
            }
        }
    });

    // Users.findOne({username : signupData.username}, (err, rows) => {
    //     if (err){
    //         console.log(err);
    //         console.log("unable to read the database");
    //         res.status(401).send({responseMessage: err});
    //     } else {
    //         if(rows){
    //             console.log("User already exists");
    //             res.status(401).send({responseMessage: "User already exists"});
    //         } else {
    //             encrypt.createHash(encryptPass, function (response){
    //                 signupData.password = response;
    //                 console.log("Encrypted Password is: " + signupData.password);
                    
    //                 Users.create(signupData, function (err,user) {
    //                     if (err) {
    //                         console.log("unable to insert into database", err);
    //                         res.status(401).send({responseMessage: err});
    //                     } else {
    //                         console.log("User added");
    //                         res.status(200).send({responseMessage: user})
    //                     }
    //                 });
    //             }, function (err) {
    //                 console.log(err);
    //                 res.status(401).send({responseMessage: 'Error Occurred'});
    //             });
    //         }
            
    //     }
    // })
    //password encryption
    
})

router.route('/SignUpOwner').post(function(req, res){
    console.log("SignUp Owner");
    var encryptPass = req.body.password;
    var signupData = {
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password,
        "mob": req.body.mob,
        "restname": req.body.restname,
        "restzip": req.body.restzip,
        "cuisine": req.body.cuisine
    }

    var msg = {
        signupData : signupData,
        encryptPass : encryptPass
    }

    kafka.make_request('SignUpOwner', msg, function(err,results){
        console.log('Sending request to Kafka');

        if(err){
            console.log(err);
            res.status(401).send({responseMessage : results.responseMessage});
        } else {
            if(results.status == 401){
                console.log("Status 401 Occurred. Please try again");
                res.status(401).send({responseMessage : results.responseMessage});
            } else{
                console.log("Process successful");
                res.status(200).send({responseMessage : results.responseMessage});
            }
        }
    });

    // Owners.findOne({email : signupData.email}, (err, rows) => {
    //     if (err){
    //         console.log(err);
    //         console.log("unable to read the database");
    //         res.status(401).send({responseMessage: err});
    //     } else {
    //         if(rows){
    //             console.log("Owner already exists");
    //             res.status(401).send({responseMessage: "Owner already exists"});
    //         } else {
    //             encrypt.createHash(encryptPass, function (response){
    //                 signupData.password = response;
    //                 console.log("Encrypted Password is: " + signupData.password);
                    
    //                 Owners.create(signupData, function (err,user) {
    //                     if (err) {
    //                         console.log("unable to insert into database", err);
    //                         res.status(401).send({responseMessage: err});
    //                     } else {
    //                         console.log("Owner added");
    //                         res.status(200).send({responseMessage: user})
    //                     }
    //                 });
    //             }, function (err) {
    //                 console.log(err);
    //                 res.status(401).send({responseMessage: 'Error Occurred'});
    //             });
    //         }
            
    //     }
    // })
      
})

router.route('/loginUser').post((req, res) => {
    console.log("Inside login");
    var username = req.body.username;
    var password = req.body.password;

    var msg = {
        username : username,
        password : password
    }

    kafka.make_request('loginUser',msg, function(err,results){
        console.log('Sending request to Kafka');
        //console.log(results);
        if (err){
            //console.log("Inside err");
            res.status(401).send({responseMessage: 'Authentication failed. Passwords did not match.'});
        }else{
            //console.log("Inside else");
            var token = jwt.sign({username : results.responseMessage.username}, 'secretkey', {expiresIn : 7200});
            res.cookie('cookie',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookieemail',results.responseMessage.username,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookiename',results.responseMessage.name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).send({responseMessage: results.responseMessage, token : 'Bearer ' + token});
        }
        
    });
    //console.log(username, password)
    // Users.findOne({username : username}, (err, user) => {
    //     if (err){
    //         console.log(err);
    //         console.log("unable to read the database");
    //         res.status(401).send({responseMessage: err});
    //     } else {
    //         if(user) {
    //             console.log(user);
    //             encrypt.compareHash(password, user.password, function(err, isMatch){
    //                 if (isMatch && !err) {
    //                     var token = jwt.sign({username : user.username}, 'secretkey', {expiresIn : 7200});
    //                     console.log("User Login Successful");
    //                     res.cookie('cookie',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.cookie('cookieemail',user.username,{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.cookie('cookiename',user.name,{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.status(200).send({responseMessage: user, token : 'Bearer ' + token});
    //                 } else {
    //                     console.log("Authentication failed. Passwords did not match");
    //                     res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
    //                 }

    //             }, function (err) {
    //                 console.log(err);
    //                 res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
    //             });
    //         } else {
    //             console.log("User does not exist");
    //             res.status(401).send({responseMessage: 'User does not exist'});
    //         }

    //     }
    // })


    
});

router.route('/loginOwner').post((req, res) => {
    console.log("Inside login");
    var email = req.body.username;
    var password = req.body.password;

    var msg = {
        email : email,
        password : password
    }

    kafka.make_request('loginOwner', msg, function(err,results){
        console.log('Sending request to Kafka');
        //console.log(results);
        if (err){
            //console.log("Inside err");
            res.status(401).send({responseMessage: 'Authentication failed. Passwords did not match.'});
        }else{
            //console.log("Inside else");
            var token = jwt.sign({email : results.responseMessage.email}, 'secretkey', {expiresIn : 7200});
            res.cookie('cookie',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookieemail',results.responseMessage.email,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookiename',results.responseMessage.name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookierestname',results.responseMessage.restname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).send({responseMessage: results.responseMessage, token : 'Bearer ' + token});
            }
        
    });

    // Owners.findOne({email : email}, (err, user) => {
    //     if (err){
    //         console.log(err);
    //         console.log("unable to read the database");
    //         res.status(401).send({responseMessage: err});
    //     } else {
    //         if(user) {
    //             console.log(user);
    //             encrypt.compareHash(password, user.password, function(err, isMatch){
    //                 if (isMatch && !err) {
    //                     var token = jwt.sign({email : user.email}, 'secretkey', {expiresIn : 7200});
    //                     console.log("User Login Successful");
    //                     res.cookie('cookie',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.cookie('cookieemail',email,{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.cookie('cookiename',user.name,{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.cookie('cookierestname',user.restname,{maxAge: 900000, httpOnly: false, path : '/'});
    //                     res.status(200).send({responseMessage: user, token : 'Bearer ' + token});
    //                 } else {
    //                     console.log("Authentication failed. Passwords did not match");
    //                     res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
    //                 }

    //             }, function (err) {
    //                 console.log(err);
    //                 res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
    //             });
    //         } else {
    //             console.log("User does not exist");
    //             res.status(401).send({responseMessage: 'User does not exist'});
    //         }

    //     }
    // })
    
});

module.exports = router;