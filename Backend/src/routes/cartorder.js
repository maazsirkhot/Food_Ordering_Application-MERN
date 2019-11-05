var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Items = require('../models/items');
var Carts = require('../models/cart');
var passport = require('passport');
var kafka = require('../../Kafka/client');

router.route('/Orders').post(passport.authenticate('jwt', { session: false }), function (req, res) {
    //console.log(req.body);

    //Get userdata from data attribute of object in request. 
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

    // Carts.collection.insertMany(cartItems, (err, result) => {
    //     if (err) {
    //         console.log("Unable to add to cart", err);
    //         res.status(401).send({ responseMessage: err });
    //     } else {
    //         console.log("Order added to cart", result);
    //         res.status(200).send({ responseMessage: result })
    //     }
    // })


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

    // arraySearch = (id, arr) => {
    //     for (i = 0; i < arr.length; i++) {
    //         if (arr[i].cartid == id)
    //             return i;
    //     }
    //     return -1;
    // }

    
    // newOrders = [];
    // otherOrders = [];


    // Carts.find({ restname: restname }, (err, result) => {
    //     if (err) {
    //         console.log("Unable to get orders", err);
    //         res.status(401).send({ responseMessage: err });
    //     } else {
    //         console.log("Order received from cart");

    //         if (result.length > 0) {
    //             for (item of result) {
    //                 if (item.orderstatus != 'DELIVERED' && item.orderstatus != 'CANCELLED') {
    //                     order = arraySearch(item.cartid, newOrders);
    //                     if (order != -1) {
    //                         var itm = {
    //                             itemname: item.itemname,
    //                             quantity: item.quantity,
    //                             itemprice: item.itemprice,
    //                             price: item.price
    //                         }
    //                         newOrders[order].items.push(itm);
    //                     } else {
    //                         newOrders.push({
    //                             cartid: item.cartid,
    //                             username: item.username,
    //                             address: item.address,
    //                             orderstatus: item.orderstatus,
    //                             totalprice: item.totalprice,
    //                             messages : item.messages,
    //                             items: [itm = {
    //                                 itemname: item.itemname,
    //                                 quantity: item.quantity,
    //                                 itemprice: item.itemprice,
    //                                 price: item.price
    //                             }]
    //                         })
    //                     }
    //                 } else {
    //                     order = arraySearch(item.cartid, otherOrders);
    //                     if (order != -1) {
    //                         var itm = {
    //                             itemname: item.itemname,
    //                             quantity: item.quantity,
    //                             itemprice: item.itemprice,
    //                             price: item.price
    //                         }
    //                         otherOrders[order].items.push(itm);
    //                     } else {
    //                         otherOrders.push({
    //                             cartid: item.cartid,
    //                             username: item.username,
    //                             address: item.address,
    //                             orderstatus: item.orderstatus,
    //                             totalprice: item.totalprice,
    //                             items: [itm = {
    //                                 itemname: item.itemname,
    //                                 quantity: item.quantity,
    //                                 itemprice: item.itemprice,
    //                                 price: item.price
    //                             }]
    //                         })
    //                     }
    //                 }
    //             }
    //             console.log(newOrders, otherOrders);
    //             allOrders = {
    //                 newOrders: newOrders,
    //                 otherOrders: otherOrders
    //             }
    //             res.status(200).json({ responseMessage : allOrders});

    //         }
    //         //res.status(200).send({responseMessage: result})
    //     }
    // })

})

router.route('/getUserOrders').post(passport.authenticate('jwt', { session: false }), function (req, res) {
    console.log("Inside getUserOrders");
    var username = req.body.username;
    console.log(username);
    
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

    // arraySearch = (id, arr) => {
    //     for (i = 0; i < arr.length; i++) {
    //         if (arr[i].cartid == id)
    //             return i;
    //     }
    //     return -1;
    // }

    // newOrders = [];
    // otherOrders = [];
    
    // Carts.find({ username: username }, (err, result) => {
    //     if (err) {
    //         console.log("Unable to get orders", err);
    //         res.status(401).send({ responseMessage: err });
    //     } else {
    //         console.log("Order received from cart");

    //         if (result.length > 0) {
    //             for (item of result) {
    //                 if (item.orderstatus != 'DELIVERED' && item.orderstatus != 'CANCELLED') {
    //                     order = arraySearch(item.cartid, newOrders);
    //                     if (order != -1) {
    //                         var itm = {
    //                             itemname: item.itemname,
    //                             quantity: item.quantity,
    //                             itemprice: item.itemprice,
    //                             price: item.price
    //                         }
    //                         newOrders[order].items.push(itm);
    //                     } else {
    //                         newOrders.push({
    //                             cartid: item.cartid,
    //                             username: item.username,
    //                             address: item.address,
    //                             orderstatus: item.orderstatus,
    //                             totalprice: item.totalprice,
    //                             restname : item.restname,
    //                             items: [itm = {
    //                                 itemname: item.itemname,
    //                                 quantity: item.quantity,
    //                                 itemprice: item.itemprice,
    //                                 price: item.price
    //                             }]
    //                         })
    //                     }
    //                 } else {
    //                     order = arraySearch(item.cartid, otherOrders);
    //                     if (order != -1) {
    //                         var itm = {
    //                             itemname: item.itemname,
    //                             quantity: item.quantity,
    //                             itemprice: item.itemprice,
    //                             price: item.price
    //                         }
    //                         otherOrders[order].items.push(itm);
    //                     } else {
    //                         otherOrders.push({
    //                             cartid: item.cartid,
    //                             username: item.username,
    //                             address: item.address,
    //                             orderstatus: item.orderstatus,
    //                             totalprice: item.totalprice,
    //                             items: [itm = {
    //                                 itemname: item.itemname,
    //                                 quantity: item.quantity,
    //                                 itemprice: item.itemprice,
    //                                 price: item.price
    //                             }]
    //                         })
    //                     }
    //                 }
    //             }
    //             console.log(newOrders, otherOrders);
    //             allOrders = {
    //                 newOrders: newOrders,
    //                 otherOrders: otherOrders
    //             }
    //             res.status(200).json({ responseMessage : allOrders});

    //         }
    //         //res.status(200).send({responseMessage: result})
    //     }
    // })
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
    
    // Carts.updateMany({cartid : updateCart.cartid}, { $set: updateCart}, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         console.log("Unable to update Database");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("Result:", result)
    //         console.log("Cart update Successful");
    //         res.status(200).json({responseMessage: result});
    //     } 
    // })
})

router.route('/addMessage').post(passport.authenticate('jwt', { session: false }), function (req, res){
    console.log("Inside Add Message");
    var cartid = req.body.cartid;
    var msg = {
        author : req.body.username,
        message : req.body.message
    }
    console.log(msg)

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

    // Carts.updateMany({cartid : cartid}, {$push: {"messages": msg}}, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         console.log("Unable to update Database");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("Result:", result)
    //         console.log("Message add Successful");
    //         res.status(200).json({responseMessage: result});
    //     } 
    // })
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

    // var messages = [];
    // console.log(cartid)
    // Carts.findOne({cartid : cartid}, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //         console.log("Unable to update Database");
    //         res.status(400).json({responseMessage: 'Error Occurred'});
    //     } else {
    //         console.log("Result:", result)
    //         if(result != null){
    //             messages = result.messages;
    //         }
            
    //         console.log(messages);
    //         res.status(200).json({responseMessage: messages});
    //     } 
    // })
})

module.exports = router;