'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ShoppingCartSchema = new Schema({
    name: { 
        type: String,
        required: true,

    },

    amount:{
        type: Number,
        required: true,
    },

    price:{
        type: Number,
        required: true,
    },


});

module.exports = mongoose.model("shoppingCart",ShoppingCartSchema)