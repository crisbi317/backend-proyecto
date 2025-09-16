import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema = new mongoose.Schema({
   
      title: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      status: { type: Boolean, default: true },
      category: { type: String, required: true },
      stock: { type: Number, default: 0 },
      thumbnail: String,
      code: { type: String, unique: true, required: true }
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model("Product", productSchema);

export default productModel;