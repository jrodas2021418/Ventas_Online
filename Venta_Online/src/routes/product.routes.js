'use strict'

const {Router} = require('express');
const { createProduct, readProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory, getProductByName, getProductByCategory } = require('../controllers/product.controller');


const api = Router();

api.post('/create-product', createProduct);
api.get('/read-product', readProduct);
api.put('/update-product/:id', updateProduct);
api.delete('/delete-product/:id', deleteProduct);

api.put('/add-category/:id', addCategory);
api.put('/update-category/:id', updateCategory );
api.delete('/delete-category/:id', deleteCategory);
api.get('/getProduct/:name', getProductByName);
api.get('/getProductCategory/:nameC', getProductByCategory);
module.exports = api;