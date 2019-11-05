var Carts = require('../models/cart');

function handle_request(msg, callback){
    console.log("Inside Add Message request");

    Carts.updateMany({cartid : msg.cartid}, {$push: {"messages": msg.msg}}, (err, result) => {
        if (err) {
            console.log(err);
            console.log("Unable to update Database");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Result:", result)
            console.log("Message add Successful");
            //res.status(200).json({responseMessage: result});
            callback(null, {status: 200, responseMessage: result});
        } 
    })
}

exports.handle_request = handle_request;