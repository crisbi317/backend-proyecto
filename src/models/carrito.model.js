
import mongoose from 'mongoose';

const carritoSchema = new mongoose.Schema({
    id:Number,
    fecha: Date,
    userId: Number,
    metodoPago: String,
    productos: Array
})

const carritoModel = mongoose.model("carrito", carritoSchema)

export default carritoModel