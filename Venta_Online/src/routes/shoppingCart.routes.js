'use strict'

const{Router} = require('express');
const{ getProductsCart, addProductCart, putProduct, deleteProduct } = require('../controllers/shoppingCart.controller');

const api = Router();

api.get('/products-cart', getProductsCart);
api.post('/products-cart', addProductCart);
api.put('/products-cart/:productId', putProduct);
api.delete('/products-cart/:productId', deleteProduct);
module.exports = api;