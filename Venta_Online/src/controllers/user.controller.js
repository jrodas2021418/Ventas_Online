'use strict'

const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const {generateJWT} = require('../helpers/create-jwt');




//Crear usuario por defecto
const AdminUser = async(req, res)=>{
    try {
        let user = new User();
        user.username = "Estuardo";
        user.password = "hola123";
        user.email = "jrodas@gmail.com";
        user.rol = "ADMIN";
        const userEncontrado = await User.findOne({ email: user.email });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
      } catch (err) {
        throw new Error(err);
      }
    };

//CRUDDDDDDDDDDDDDDDDDDD

const createUser = async(req, res)=>{
     const{email, password} = req.body;
     try {
         let user =  await User.findOne({email:email});
         if(user){
            return res.status(400).send({
                msg:'ya existe un usuario con ese correo',
                ok: false,
                user: user
            })
        }
              user = new User(req.body);

              //Encriptacion  password

              const saltos = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(password, saltos);

              //Guardar Usuarios

              user = await user.save();
              const token = await generateJWT(user.id, user.username, user.email );
              res.status(200).send({
                msg:`Usuario ${user.username}creado correctamente`,
                user,
                token,
              });
         
     } catch (error) {
        throw new Error
     }
};

const readUsers = async(req, res)=>{
   try {
        const users = await User.find();
        if(!users){
            res.status(404).send({msg:'No  hay usuarios para mostrar'});

        }else{
            res.status(200).json({users: users})
        }
   } catch (error) {
        throw new Error(error)
   }
};

const updateUser = async(req, res)=>{
    if(req.user.rol === "ADMIN"){
    try {
        const id= req.params.id;
        const userEdit = {...req.body};

        userEdit.password = userEdit.password
        ? bcrypt.hashSync(userEdit.password, bcrypt.genSaltSync())
        : userEdit.password;
        const userComplete = await User.findByIdAndDelete(id, userEdit,{
            new:true
        });

        if(userComplete){
            const token = await generateJWT(user.username, user.email);
            return res.status(200).send({msg:'Datos actualizados correctamente', userComplete, token});
        }else{
            res.status(404).send({msg:'Este usuario no existe en la base de datos'});
        }
    } catch (error) {
         throw new Error(error);
    }
}else{
    return res.status(200).send({
        message: "este usuario no tiene permisos para actualizar usuarios",
      });
}
}

const deleteUser = async(req, res)=>{
    if(req.user.rol ==="ADMIN"){
    try {
        const id = req.params.id;
        const userDelete = await User.findByIdAndDelete(id);
        return res.status(200).send({msg:'usuario eliminado exitosamente', userDelete});

    } catch (error) {
         throw new Error(error)
    }
}else{
    return res
    .status(500)
    .send({ message: "este usuario no tiene permisos para eliminar " });
}
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status.send({msg: "Este usuario no existe"});
        };
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).send({ 
                ok: false, 
                msg: "Contraseña incorrecta"});
        }

        const token = await generateJWT(user.id, user.username, user.email);
        res.send({
            ok: true,
            eId: user.id,
            username: user.username,
            email: user.email,
            token,
        })
    } catch (error) {
        throw new Error(error);
    }
};



module.exports = { 
    createUser,
    readUsers,
    updateUser,
    deleteUser,
    login,
}