var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Items = require('../models/items');
var passport = require('passport');
var Owners = require('../models/owners');
var kafka = require('../../Kafka/client');

router.route('/UserDashboard').post(passport.authenticate('jwt', { session: false }), function(req, res){
    console.log("Inside UserDashboard API");
    
    var searchRestaurant = req.body.itemname;
    console.log(searchRestaurant);

    var msg = {
        searchRestaurant : searchRestaurant
    }

    kafka.make_request('UserDashboard', msg, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            if(results.status == 401){
                res.status(401).send({responseMessage : results.responseMessage});
            } else {
                console.log("Process successful");
                res.status(200).send({responseMessage : results.responseMessage});
            }
            
            
        }
    });


    // Items.distinct('restname', { itemname: { $regex: searchRestaurant, $options: 'i' } }, (err, rows) =>{
    //     if (err) {
    //         console.log("unable to get restaurant", err);
    //         res.status(401).send({responseMessage: err});
    //     } else {
    //         console.log("Restaurant Fetched", rows);
    //         Owners.find({restname : {$in : rows}}, (err, restaurants) => {
    //             if (err) {
    //                 console.log("unable to get restaurant", err);
    //                 res.status(401).send({responseMessage: err});
    //             } else {
    //                 console.log("Restaurant Fetched", restaurants);
    //                 res.status(200).send({responseMessage: restaurants});
    //             }
    //         })
            
    //     }
    // })

})


module.exports = router;