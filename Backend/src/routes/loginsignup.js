var express = require('express');
var router = express.Router();
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
        
        if (err){
            console.log(err);
            res.status(401).send({responseMessage: 'Authentication failed. Passwords did not match.'});
        }else{
            var token = jwt.sign({username : results.responseMessage.username}, 'secretkey', {expiresIn : 7200});
            res.cookie('cookie',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookieemail',results.responseMessage.username,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookiename',results.responseMessage.name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).send({responseMessage: results.responseMessage, token : 'Bearer ' + token});
        }
        
    });
    
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
        if (err){
            console.log("Inside err");
            res.status(401).send({responseMessage: 'Authentication failed. Passwords did not match.'});
        }else{
            var token = jwt.sign({email : results.responseMessage.email}, 'secretkey', {expiresIn : 7200});
            res.cookie('cookie',"ownercookie",{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookieemail',results.responseMessage.email,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookiename',results.responseMessage.name,{maxAge: 900000, httpOnly: false, path : '/'});
            res.cookie('cookierestname',results.responseMessage.restname,{maxAge: 900000, httpOnly: false, path : '/'});
            res.status(200).send({responseMessage: results.responseMessage, token : 'Bearer ' + token});
            }
        
    });
    
});

module.exports = router;