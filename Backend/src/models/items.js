var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Items = new Schema({
    itemname: {
        type: String,
        required : true
    },
    itemdescription: {
        type: String,
        required : true
    },
    restname: {
        type: String,
        required : true
    },
    cuisine: {
        type: String
    },
    itemprice: {
        type: Number,
        required : true
    },
    section: {
        type: String,
        required : true
    },
    itemimg: {
        type: String
    }      
})

module.exports = mongoose.model('items', Items);