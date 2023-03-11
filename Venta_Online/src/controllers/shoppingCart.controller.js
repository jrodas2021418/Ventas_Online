'use strict'

const ShoppingCart=require("../models/shoppingCart.model");
const Product = require('../models/product.model');

const getProductsCart = async (req, res) =>{
    const productsCart = await ShoppingCart.find();

    if(productsCart){
        res.json({productsCart});

    }else{
        res.json({msg:'No hay productos en el carrito'});
    }
};

const addProductCart = async (req, res) =>{
    const {name, price} = req.body;

    //Buscamos si existe el producto

    const estaEnProducts = await Product.findOne({name});

    //Verificamos los campos

    const noEstaVacio = name !=="" && price!=="";

    //Verificamos si el producto esta en el carrito
    const estaEnElCarrito = await ShoppingCart.findOne({name});

    // En caso de que no este el producto mandar:

    if(!estaEnProducts){
        res.status(400).json({
            msg:'Este producto no esta disponible por el momento',
        });

        //Si nos envian un producto y no esta en el carrito se agrega
    }else if(noEstaVacio && !estaEnElCarrito){
        const newProductInCart = new ShoppingCart({name, price, amount: 1});

        //Actualizamos inCart: true en los productos
        await Product.findByIdAndUpdate(
            estaEnProducts?._id,
            { inCart: true, name, price},
            {new: true}
        )

        .then((product) =>{
            newProductInCart.save();
            res.json({
                msg: `El producto se agrego al carrito`,
                product,
            });
        })
.catch((error) => console.error(error));

    }else if(estaEnElCarrito){
        res.status(400).json({
            msg: "El producto ya esta en el carrito",
        });

    }
};

const putProduct = async (req, res)=>{
    const {productId} = req.params;
    const{query} = req.query;
    const body = req.body;

    //Buscamos el producto que este en el carrito
    const productBuscado = await Cart.findById(productId);

// Si no hay ningun query 
  if(!query){
    res.status(404).json({msg:'debes enviar una query'});
    //Si esta en el carro y necesito agregarlo
  }else if(productBuscado && query =="add"){
     body.amount = body.amount + 1;

     await ShoppingCart.findByIdAndUpdate(productId, body,{
        new: true,
     }).then ((product) =>{
        res.json({
            msg: `El producto: ${product.name} fue actualizado`,
            product,
        });
     });
     //Si queremos eliminarlo
  }else if(productBuscado && query === "del"){
     body.amount = body.amount - 1;
      
     await ShoppingCart.findByIdAndUpdate(productId, body,{
        new: true,
     }).then((product) =>
         res.json({
            msg: `El producto ${product.name} fue actualizado`,
            product,
         })
     );
  }else{
    res.status(400).json({msg:'Ocurrio un error en la peticion'});
  }
};

const deleteProduct = async(req, res) =>{
    const {productId} = req.params;

    //Buscamos el producto en el carrito
    const productInCart = await ShoppingCart.findById(productId);

    //Buscamos el producto en la base de datos 
    //por el nombre del producto que este en el carrtio
    const {name, price, _id} = await Product.findOne({
        name: productInCart.name,
    });

    //Buscamos y eliminados con el id del producto
    await ShoppingCart.findByIdAndDelete(productId);

    await Product.findByIdAndUpdate(
        _id,
        {inCart: false, name,price},
        {new: true}
    )
    .then((product)=>{
        res.json({
            msg:`El producto ${product.name} fue eliminado del carrito`,
        });
    })
    .catch((error)=> res.json({msg: "Ocurrio un error con su peticion"}));
}




module.exports ={
    getProductsCart,
    addProductCart,
    putProduct,
    deleteProduct,
}