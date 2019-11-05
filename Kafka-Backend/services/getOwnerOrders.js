var Carts = require('../models/cart');

function handle_request(msg, callback){
    console.log("Inside Get Owner Orders request");

    arraySearch = (id, arr) => {
        for (i = 0; i < arr.length; i++) {
            if (arr[i].cartid == id)
                return i;
        }
        return -1;
    }

    
    newOrders = [];
    otherOrders = [];


    Carts.find({ restname: msg.restname }, (err, result) => {
        if (err) {
            console.log("Unable to get orders", err);
            //res.status(401).send({ responseMessage: err });
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Order received from cart");

            if (result.length > 0) {
                for (item of result) {
                    if (item.orderstatus != 'DELIVERED' && item.orderstatus != 'CANCELLED') {
                        order = arraySearch(item.cartid, newOrders);
                        if (order != -1) {
                            var itm = {
                                itemname: item.itemname,
                                quantity: item.quantity,
                                itemprice: item.itemprice,
                                price: item.price
                            }
                            newOrders[order].items.push(itm);
                        } else {
                            newOrders.push({
                                cartid: item.cartid,
                                username: item.username,
                                address: item.address,
                                orderstatus: item.orderstatus,
                                totalprice: item.totalprice,
                                messages : item.messages,
                                items: [itm = {
                                    itemname: item.itemname,
                                    quantity: item.quantity,
                                    itemprice: item.itemprice,
                                    price: item.price
                                }]
                            })
                        }
                    } else {
                        order = arraySearch(item.cartid, otherOrders);
                        if (order != -1) {
                            var itm = {
                                itemname: item.itemname,
                                quantity: item.quantity,
                                itemprice: item.itemprice,
                                price: item.price
                            }
                            otherOrders[order].items.push(itm);
                        } else {
                            otherOrders.push({
                                cartid: item.cartid,
                                username: item.username,
                                address: item.address,
                                orderstatus: item.orderstatus,
                                totalprice: item.totalprice,
                                items: [itm = {
                                    itemname: item.itemname,
                                    quantity: item.quantity,
                                    itemprice: item.itemprice,
                                    price: item.price
                                }]
                            })
                        }
                    }
                }
                console.log(newOrders, otherOrders);
                allOrders = {
                    newOrders: newOrders,
                    otherOrders: otherOrders
                }
                //res.status(200).json({ responseMessage : allOrders});
                callback(null, {status: 200, responseMessage: allOrders});

            }
            //res.status(200).send({responseMessage: result})
        }
    })
}

exports.handle_request = handle_request;