var Items = require('../models/items');

function handle_request(msg, callback){
    console.log("Inside Update Menu Request")
    
    var item = msg.item;
    var itemstatus = msg.itemstatus;
    var newitemname = msg.newitemname;
    
    if(itemstatus == 'NEW'){
        console.log("New Item Creation");

        Items.create(item, (err, item) => {
            if (err) {
                console.log("unable to insert into database", err);
                //res.status(401).send({responseMessage: err});
                callback(err, {status: 401, responseMessage: "unable to insert into the database"});
            } else {
                console.log("Item added");
                //res.status(200).send({responseMessage: item})
                callback(null, {status: 200, responseMessage: item});
            }
        })
    } else if (itemstatus == 'DELETE'){
        console.log("Delete Query");

        Items.findOneAndDelete({itemname : item.itemname, restname : item.restname}, (err, item) => {
            if (err) {
                console.log("unable to remove item", err);
                //res.status(401).send({responseMessage: err});
                callback(err, {status: 401, responseMessage: "unable to insert into the database"});
            } else {
                console.log("Item Deleted");
                //res.status(200).send({responseMessage: item})
                callback(null, {status: 200, responseMessage: item});
            }
        })
    } else if (itemstatus == 'DELETESECTION'){
        console.log("Delete Section");

        Items.deleteMany({section : item.section, restname : item.restname}, (err, item) => {
            if (err) {
                console.log("unable to delete section", err);
                //res.status(401).send({responseMessage: err});
                callback(err, {status: 401, responseMessage: "unable to insert into the database"});
            } else {
                console.log("Section Deleted");
                //res.status(200).send({responseMessage: item})
                callback(null, {status: 200, responseMessage: item});
            }
        })
    }
    else if (itemstatus == 'UPDATEITEM'){
        var temp = item.itemname;
        item.itemname = newitemname;
        newitemname = temp;

        Items.findOneAndUpdate({itemname : newitemname, restname : item.restname}, item, (err, items) => {
            if (err) {
                console.log("Unable to update Database");
                //res.status(400).json({responseMessage: 'Error Occurred'});
                callback(err, {status: 401, responseMessage: "unable to insert into the database"});
            } else {
                console.log("Item update Successful");
                //res.status(200).json({responseMessage: items});
                callback(null, {status: 200, responseMessage: item});
            } 
        })

    }
}

exports.handle_request = handle_request;