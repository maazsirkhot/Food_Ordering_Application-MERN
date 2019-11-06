var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Items = require('../models/items');
var Carts = require('../models/cart');
var passport = require('passport');
var kafka = require('../../Kafka/client');

router.route('/Orders').post(passport.authenticate('jwt', { session: false }), function (req, res) { 
    var cart = req.body.data;
    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    var minutes = d.getMinutes();
    var hr = d.getHours();
    var sec = d.getSeconds();
    var cartItems = [];
    cart.forEach(item => {
        eachItem = {
            cartid: item.username.slice(0, 5) + item.restname.slice(0, 5) + dd + mm + yyyy + hr + minutes + sec,
            username: item.username,
            address: item.address,
            restname: item.restname,
            itemname: item.itemname,
            itemprice: item.itemprice,
            quantity: item.quantity,
            price: item.itemprice * item.quantity,
            totalprice: item.totalprice,
            orderstatus: "NEW"
        }
        cartItems.push(eachItem);
    });
    
    console.log(cartItems);

    var msg = {
        cartItems : cartItems
    }

    kafka.make_request('Orders', msg, function(err,results){
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

})

router.route('/getOwnerOrders').post(passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("Inside getOwnerOrders");
    
    var restname = req.body.restname;
    var msg = {
        restname : restname
    }
    
    kafka.make_request('getOwnerOrders', msg, function(err,results){
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

})

router.route('/getUserOrders').post(passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("Inside getUserOrders");
    
    var username = req.body.username;
    var msg = {
        username : username
    }

    kafka.make_request('getUserOrders', msg, function(err,results){
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

})

router.route('/updateStatus').post(passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("Inside Order Status Update");
    
    var updateCart = {
        restname : req.body.restname,
        cartid : req.body.cartid,
        orderstatus : req.body.orderstatus
    }

    kafka.make_request('updateStatus', updateCart, function(err,results){
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
    
})

router.route('/addMessage').post(passport.authenticate('jwt', { session: false }), function (req, res){
    console.log("Inside Add Message");
    
    var cartid = req.body.cartid;
    var msg = {
        author : req.body.username,
        message : req.body.message
    }
    var msgkafka = {
        cartid : cartid,
        msg : msg
    }

    kafka.make_request('addMessage', msgkafka, function(err,results){
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

})

router.route('/getMessage').post(passport.authenticate('jwt', { session: false }), function (req, res){
    console.log("Inside Get Message");
    
    var cartid = req.body.cartid;
    var msg = {
        cartid : cartid
    }

    kafka.make_request('getMessage', msg, function(err,results){
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

})

module.exports = router;