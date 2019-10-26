var express = require('express');
var pool = require('../helpers/pool');
var router = express.Router();
var crypt = require('../helpers/passwordEncryption');
var Items = require('../models/items');
var passport = require('passport');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({storage: storage});

router.route('/GetMenu').post(passport.authenticate('jwt', { session: false }), function(req, res){
    console.log("Inside Menu");
    var restname = req.body.restname;
    console.log(restname);
    var allSections = [];

    arraySearch = (sect, arr) => {
        for(i = 0; i < arr.length; i++){
            if(arr[i].section == sect)
                return i;
        }
        return -1;
    }

    Items.find({restname : restname}, (err, rows) => {
        if (err) {
            console.log("unable to get restaurant", err);
            res.status(401).send({responseMessage: err});
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
                res.status(200).json(allSections);
            } else {
                console.log("No Items Found");
                res.status(400).json({responseMessage: 'Menu not available'});
            }
        }
    })

})

router.route('/updateMenu').post(passport.authenticate('jwt', { session: false }), upload.single('imglink'), function(req, res){
    console.log("Inside Update Menu");
    var item = {
        itemname : req.body.itemname,
        itemdescription : req.body.itemdescription,
        restname : req.body.restname,
        itemprice :req.body.itemprice,
        section : req.body.section,
        cuisine : req.body.cuisine
    }
    var itemstatus = req.body.itemstatus;
    var newitemname = req.body.newitemname;
        

    if(itemstatus == 'NEW'){
        if(req.file){
            item.itemimg = req.file.filename;
            console.log("Image received", item.itemimg)
        }
        Items.create(item, (err, item) => {
            if (err) {
                console.log("unable to insert into database", err);
                res.status(401).send({responseMessage: err});
            } else {
                console.log("Item added");
                res.status(200).send({responseMessage: item})
            }
        })
    } else if (itemstatus == 'DELETE'){
        console.log("Delete Query");

        Items.findOneAndDelete({itemname : item.itemname, restname : item.restname}, (err, item) => {
            if (err) {
                console.log("unable to remove item", err);
                res.status(401).send({responseMessage: err});
            } else {
                console.log("Item Deleted");
                res.status(200).send({responseMessage: item})
            }
        })
    } else if (itemstatus == 'DELETESECTION'){
        console.log("Delete Section");

        Items.deleteMany({section : item.section, restname : item.restname}, (err, item) => {
            if (err) {
                console.log("unable to delete section", err);
                res.status(401).send({responseMessage: err});
            } else {
                console.log("Section Deleted");
                res.status(200).send({responseMessage: item})
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
                res.status(400).json({responseMessage: 'Error Occurred'});
            } else {
                console.log("Item update Successful");
                res.status(200).json({responseMessage: items});
            } 
        })

    }
})


module.exports = router;