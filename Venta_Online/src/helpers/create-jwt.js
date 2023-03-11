const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const generateJWT = async(uId, username, email) =>{
    const payload = {uId, username, email};
    try {
        const token = await jwt.sign(payload, secret, {
           expiresIn: "1h",
        });
        return token;

    } catch (error) {
        throw new Error (error + "No se ah podido generar su token ");
    }
};

module.exports = {generateJWT};
