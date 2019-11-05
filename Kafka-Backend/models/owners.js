var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Owners = new Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    password: {
        type: String,
        required : true
    },
    mob: {
        type: String
    },
    restname: {
        type: String,
        required : true
    },
    restzip: {
        type: String,
        required : true
    },
    cuisine: {
        type: String,
        required : true
    },
    ownerimg: {
        type: String
    },
    restimg: {
        type: String
    }
})

module.exports = mongoose.model('owners', Owners);