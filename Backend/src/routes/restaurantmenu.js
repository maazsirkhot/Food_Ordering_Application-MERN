var express = require('express');
var router = express.Router();
var passport = require('passport');
var kafka = require('../../Kafka/client');

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
    var msg = {
        restname : restname
    }

    kafka.make_request('GetMenu', msg, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            if(results.status == 401){
                res.status(401).send({responseMessage : results.responseMessage});
            } else {
                console.log("Process successful");
                res.status(200).json(results.responseMessage);
            }
        }
    });

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
    
    if(req.file){
        item.itemimg = req.file.filename;
        console.log("Image received", item.itemimg)
    }

    msg = {
        item : item,
        itemstatus : itemstatus,
        newitemname : newitemname
    }

    kafka.make_request('updateMenu', msg, function(err,results){
        if(err){
            console.log(err);
            res.status(401).send({responseMessage : err});
        } else {
            if(results.status == 401){
                res.status(401).send({responseMessage : results.responseMessage});
            } else {
                console.log("Process successful");
                res.status(200).send({ responseMessage : results.responseMessage});
            }
        }
    });

})


module.exports = router;