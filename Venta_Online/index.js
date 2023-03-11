'use strict'

const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
const{connection} = require("./src/database/connection")
const port = process.env.PORT;
const routes = require('./src/routes/user.routes')
const routes2 = require('./src/routes/product.routes');
const routes3 = require('./src/routes/shoppingCart.routes');
connection();

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());

app.use('/api', routes, routes2, routes3);



app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}`);
});

module.exports = app;
