'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name:{
        type: String,
        required:true
    },

    inCart:{
        type: Boolean,
        default: false,
    },
    price: String,
    stock: String,
    codebar: String,
    category:[{
        nameC:String,
        
    }]




});


module.exports = mongoose.model('product', ProductSchema);