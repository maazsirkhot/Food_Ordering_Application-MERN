var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Users = require('../models/users');
var Owners = require('../models/owners')
var passport = require('passport');
var kafka = require('../../Kafka/client');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({storage: storage});


router.route('/OwnerProfile').post(passport.authenticate('jwt', { session: false }), upload.single('imglink'), function(req, res){
    console.log("OwnerProfile");
    //console.log(req.files);

    var signupData = {
        "name": req.body.name,
        "email": req.body.email,
        "mob": req.body.mob,
        "restzip": req.body.restzip,
        "cuisine": req.body.cuisine
    }

    if(req.file){
        signupData.restimg = req.file.filename;
        console.log("Image received", signupData.restimg);
    }

    kafka.make_request('OwnerProfile', signupData, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            console.log("Process successful");
            res.status(200).send({responseMessage : results.responseMessage});
        }
    });
    
    // Owners.findOneAndUpdate({email:signupData.email}, signupData, (err,user) =>{
    //     if (err) {
    //         console.log(err);
    //         console.log("Unable to update Database");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("Result:", user)
    //         console.log("Profile update Successful");
    //         res.status(200).json({responseMessage: user});
    //     } 
    // })

})

router.route('/UserProfile').post(passport.authenticate('jwt', { session: false }), upload.single('imglink'), function(req, res){
    console.log("User Profile");
    var signupData = {
        "name": req.body.name,
        "username": req.body.username,
        "contact": req.body.contact,
        "address": req.body.address
    }

    if(req.file){
        
        signupData.imglink = req.file.filename;
        console.log("Image received", signupData.imglink)
    }

    kafka.make_request('UserProfile', signupData, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            console.log("Process successful");
            res.status(200).send({responseMessage : results.responseMessage});
        }
    });
    
    // Users.findOneAndUpdate({username:signupData.username}, signupData, (err,user) =>{
    //     if (err) {
    //         console.log(err);
    //         console.log("Unable to update Database");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("Result:", user)
    //         console.log("Profile update Successful");
    //         res.status(200).json({responseMessage: user});
    //     } 
    // })
})

router.route('/GetUserProfile').post(passport.authenticate('jwt', { session: false }), function(req, res){
    console.log("Inside get user profile");

    var username = req.body.username;
    var msg = {
        username : username
    }

    kafka.make_request('GetUserProfile', msg, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            console.log("Process successful");
            res.status(200).send({responseMessage : results.responseMessage});
        }
    });

    // Users.findOne({username:username}, function(err,user){
    //     if (err) {
    //         console.log(err);
    //         console.log("User not found");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("user:", user)
    //         console.log("User Profile Fetched Successful");
    //         res.status(200).json({responseMessage: user});
    //     } 
    // })

})

router.route('/GetOwnerProfile').post(passport.authenticate('jwt', { session: false }), function(req, res){
    console.log("Inside get owner profile");

    var email = req.body.email;

    var msg = {
        email : email
    }

    kafka.make_request('GetOwnerProfile', msg, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            console.log("Process successful");
            res.status(200).send({responseMessage : results.responseMessage});
        }
    });

    // Owners.findOne({email:email}, function(err,user){
    //     if (err) {
    //         console.log(err);
    //         console.log("User not found");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("user:", user)
    //         console.log("Owner Profile Fetched Successful");
    //         res.status(200).json({responseMessage: user});
    //     } 
    // })

})

module.exports = router;