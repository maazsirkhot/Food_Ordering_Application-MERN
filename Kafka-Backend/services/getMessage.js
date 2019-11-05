var Carts = require('../models/cart');

function handle_request(msg, callback){
    console.log("Inside Get Message request");

    var messages = [];
    
    Carts.findOne({cartid : msg.cartid}, (err, result) => {
        if (err) {
            console.log(err);
            console.log("Unable to update Database");
            //res.status(400).json({responseMessage: 'Error Occurred'});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Result:", result)
            if(result != null){
                messages = result.messages;
            }
            //console.log(messages);
            //res.status(200).json({responseMessage: messages});
            callback(null, {status: 200, responseMessage: messages});
        } 
    })
}

exports.handle_request = handle_request;