import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id:Number,
    nombre:  String,
    description:String,
    precio: Number,
    imagen:Object,
    code:  String,
    stock: Number, 
    status:  Boolean,
    category:  String
})

const productModel = mongoose.model("productos", productSchema)

export default productModel

