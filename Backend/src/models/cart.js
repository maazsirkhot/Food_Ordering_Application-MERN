var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Cart = new Schema({
    cartid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    restname: {
        type: String,
        required: true
    },
    orderstatus: {
        type: String,
        required: true
    },
    totalprice: {
        type: Number,
        required: true
    },
    itemname: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    itemprice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    messages: [
        {
            author: {
                type: String
            },
            message: {
                type: String
            }

        }
    ]

})

module.exports = mongoose.model('cart', Cart);