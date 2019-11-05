var Users = require('../models/users');
var Items = require('../models/items');
var Owners = require('../models/owners');

function handle_request(msg, callback){
    console.log("Inside UserDashboard request");

    Items.distinct('restname', { itemname: { $regex: msg.searchRestaurant, $options: 'i' } }, (err, rows) =>{
        if (err) {
            console.log("unable to get restaurant", err);
            //res.status(401).send({responseMessage: err});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Restaurant Fetched", rows);
            Owners.find({restname : {$in : rows}}, (err, restaurants) => {
                if (err) {
                    console.log("unable to get restaurant", err);
                    //res.status(401).send({responseMessage: err});
                    callback(err, {status: 401, responseMessage: "unable to insert into the database"});
                } else {
                    console.log("Restaurant Fetched", restaurants);
                    //res.status(200).send({responseMessage: restaurants});
                    callback(null, {status: 200, responseMessage: restaurants});
                }
            }) 
        }
    })
}

exports.handle_request = handle_request;