' use strict'

const   axios  = require('axios');
const productModel = require('../models/product.model');
const Product = require('../models/product.model');

//CRUD de Productos 

const createProduct = async(req, res)=>{
    const{codebar} = req.body;
    try {
        let product = await Product.findOne({codebar:codebar});
        if(product){
            return res.status(400).send({msg: 'Este codigo pertenece a otro producto',
            ok: false,
            product: product
        });
        }
        product = new Product(req.body);

        product = await product.save();
        res.status(200).send({msg:`Producto ${product.name} creado exitosamente`, product});

    } catch (error) {
        throw new Error(error)
    }

};

const readProduct = async(req, res)=>{
    try {
        const product = await Product.find();

        if(!product){
            res.status(400).send({msg:'No hay productos en la base'});
        }else{
            res.status(200).json({product:product})
        }
    } catch (error) {
        throw new Error(error)
    }
};

const updateProduct = async(req, res)=>{
    try {
        const id=req.params.id;
        const productEdit = {...req.body};
        const productComplete = await Product.findByIdAndUpdate(id, productEdit,{
            new: true
        });
        if(productComplete){
           return res.status(200).send({msg:'Producto actualizado correctamente', productComplete});

        }else{
            res.status(404).send({msg:'este producto no esta disponible'});
        }
    } catch (error) {
       throw new Error(error); 
    }
};

const deleteProduct = async(req, res)=>{
    try {
        const id=req.params.id;
        const productDelete = await Product.findByIdAndDelete(id);
        return res.status(200).send({msg:'Producto eliminado correctamente',productDelete});
    } catch (error) {
        throw new Error(error)
    }
};

const addCategory = async(req, res)=>{
    try {
        const id = req.params.id;
        const{nameC} = req.body;
        
        const productCategory = await Product.findByIdAndUpdate(
          id,
          {
            $push:{
                category:{
                    nameC: nameC,
                },
            },
          },
          {new: true}
        );
        if(!productCategory){
            return res.status(404).send({
                msg:'Producto no encontrado'
            });
        }
        return res.status(200).send({productCategory});
    } catch (error) {
        throw new Error(error);
    }
};

const updateCategory = async(req, res)=>{
    const id= req.params.id;
    const{idcategory, nameC} = req.body;
    try {
        const editCategory = await Product.updateOne(
            {_id: id, "category._id": idcategory},
            {
                $set:{
                    "category.$.nameC": nameC,
                    "category.$.idcategory": idcategory,
                },
            },
            {new: true}
        );
        if( !editCategory){
            return res.status(404).send({
                msg:"No existe esta categoria"
            });
        }

        return res
        .status(200)
        .send({
            editCategory,
            msg:"Categoria actualizada exitosamente"
        });
    } catch (error) {
        throw new Error(error);
    }
};

const deleteCategory = async(req, res)=>{
    const id = req.params.id;
    const {idcategory}= req.body;
   try {
    const deleteCategory = await Product.updateOne(
        {_id: id, "category._id": idcategory},
        {
            $pull:{category:{_id: idcategory}},
        },
        {new: true, multi:false}
    );
    if(!deleteCategory){
        return res.status(404).send({
            msg:"Esta categoria no existe"
        });
    }
    return res.status(200).send({deleteCategory})
   } catch (error) {
    throw new Error(error);
   }
};

 const getProductByName = async (req, res) =>{
    const {name} = req.params;
    const ProductFound = await productModel.find({
        name: {$eq: name},
    });
    res.json(ProductFound);
 };

 const getProductByCategory = async (req, res) =>{
    const {nameC} = req.query;
       productModel
       .find({
        category: { $not: {size: 0}},
    })
    .populate({path: 'category', match:{name: nameC}})
    .exec((error, product)=>{
       if(error){
        console.log(error);
        return res.send(error.message);
       }
       const ProductByCategory = product.filter(
       (product) => product.category.length >0
       );
   
    res.json(ProductByCategory);
   });
 }



module.exports={
    createProduct,
    readProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    getProductByName,
    getProductByCategory,


}

