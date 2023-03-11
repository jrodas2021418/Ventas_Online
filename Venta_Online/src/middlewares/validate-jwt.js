const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Users = require("../models/user.model");

const validateJWT = async (req = request, res = response, next)=>{
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({msg: "No hay token en la petición"});
    }
    try {
        const payload = jwt.decode(token, process.env.SECRET_KEY);
        const productFind = await Enterprise.findById(payload.eId);
        console.log(productFind);

        if (payload.exp <= moment().unix()) {
            return res.status(500).json({msg: "El token ha expirado."});
        }

        if (!productFind) {
            return res.status(400).send({msg: "Token no valido -Esta empresa no existe en la Base de Datos"})
        };

        req.product = productFind;

        next();
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    validateJWT,
};

