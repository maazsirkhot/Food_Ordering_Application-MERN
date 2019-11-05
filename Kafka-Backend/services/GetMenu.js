var Items = require('../models/items');

function handle_request(msg, callback){
    console.log("Inside Get Menu request");

    var allSections = [];

    arraySearch = (sect, arr) => {
        for(i = 0; i < arr.length; i++){
            if(arr[i].section == sect)
                return i;
        }
        return -1;
    }

    Items.find({restname : msg.restname}, (err, rows) => {
        if (err) {
            console.log("unable to get restaurant", err);
            //res.status(401).send({responseMessage: err});
            callback(err, {status: 401, responseMessage: "unable to insert into the database"});
        } else {
            console.log("Restaurant Fetched", rows);
            if(rows.length > 0){
                for(item of rows){
                    sectNo = arraySearch(item.section, allSections);
                    if(sectNo != -1){
                        var items = {
                            itemname : item.itemname,
                            itemdescription : item.itemdescription,
                            itemprice : item.itemprice,
                            imglink : item.itemimg
                        }
                        allSections[sectNo].items.push(items);
                    }
                    else{
                        allSections.push({
                            section : item.section,
                            items : [items = {
                                itemname : item.itemname,
                                itemdescription : item.itemdescription,
                                itemprice : item.itemprice,
                                imglink : item.itemimg
                            }]
                        })
                    }

                }
                console.log(allSections);
                //res.status(200).json(allSections);
                callback(null, {status: 200, responseMessage: allSections});
            } else {
                console.log("No Items Found");
                //res.status(400).json({responseMessage: 'Menu not available'});
                callback(null, {status: 401, responseMessage: "unable to insert into the database"});
            }
        }
    })
}

exports.handle_request = handle_request;