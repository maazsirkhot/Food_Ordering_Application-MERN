var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Items = require('../models/items');
var passport = require('passport');
var Owners = require('../models/owners');

router.route('/UserDashboard').post(passport.authenticate('jwt', { session: false }), function(req, res){
    console.log("Inside UserDashboard API");
    
    var searchRestaurant = req.body.itemname;
    console.log(searchRestaurant);
    Items.distinct('restname', { itemname: { $regex: searchRestaurant, $options: 'i' } }, (err, rows) =>{
        if (err) {
            console.log("unable to get restaurant", err);
            res.status(401).send({responseMessage: err});
        } else {
            console.log("Restaurant Fetched", rows);
            Owners.find({restname : {$in : rows}}, (err, restaurants) => {
                if (err) {
                    console.log("unable to get restaurant", err);
                    res.status(401).send({responseMessage: err});
                } else {
                    console.log("Restaurant Fetched", restaurants);
                    res.status(200).send({responseMessage: restaurants});
                }
            })
            
        }
    })

})


module.exports = router;