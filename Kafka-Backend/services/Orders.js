var Carts = require('../models/cart');

function handle_request(msg, callback){
    console.log("Inside Orders requests");

    Carts.collection.insertMany(msg.cartItems, (err, result) => {
        if (err) {
            console.log("Unable to add to cart", err);
            //res.status(401).send({ responseMessage: err });
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Order added to cart", result);
            //res.status(200).send({ responseMessage: result })
            callback(null, {status: 200, responseMessage: result});
        }
    })

}

exports.handle_request = handle_request;