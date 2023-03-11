'use strict'

const {Router} = require('express');
const { createUser, readUsers, updateUser, deleteUser, login } = require('../controllers/user.controller');
const {check} = require("express-validator");
const{validateParams} = require("../middlewares/validate-params");
const {validateJWT} = require("../middlewares/validate-jwt");
const api = Router();

api.post('/create-user',[
    validateJWT,
check('username','El username es obligatorio').not().isEmpty(),
check('password', 'el password debe ser mayor a 6 digitos').isLength({min:6}),
check('email', 'el email es obligatorio').not().isEmpty(),

validateParams,
], 
createUser);
api.get('/read-users', readUsers)
api.put(
    "/update-users/:id",
  
    [
      validateJWT,
      check("username", "El username es obligatorio").not().isEmpty(),
      check("password", "El password debe ser mayor a 6 digitos").isLength({
        min: 6,
      }),
      check("email", "El email es obligatorio").not().isEmpty(),
      validateParams,
    ],
    updateUser
  );
api.delete('/delete-user/:id', deleteUser)
api.post('/login', login);
module.exports = api;
