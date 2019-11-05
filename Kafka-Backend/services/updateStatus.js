var Carts = require('../models/cart');

function handle_request(updateCart, callback){
    console.log("Inside Update Status request");

    Carts.updateMany({cartid : updateCart.cartid}, { $set: updateCart}, (err, result) => {
        if (err) {
            console.log(err);
            console.log("Unable to update Database");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Result:", result)
            console.log("Cart update Successful");
            //res.status(200).json({responseMessage: result});
            callback(null, {status: 200, responseMessage: result});
        } 
    })
}

exports.handle_request = handle_request;