// managers/ProductManager.js
import productModel from "../models/product.model.js";

class ProductManager {
  // GET productos con filtros, paginación y ordenamiento
  async getProducts(filter = {}, { limit = 10, page = 1, sort } = {}) {
    const sortOption = {};
    if (sort === "asc") sortOption.precio = 1;
    if (sort === "desc") sortOption.precio = -1;

    // Aquí usamos directamente productModel.paginate, ya que mongoose-paginate-v2
    // debe estar aplicado en el schema
    return await productModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });
  }

  // GET por ID
  async getProductById(id) {
    return await productModel.findById(id).lean();
  }

  // POST
  async addProduct(productData) {
    const last = await productModel.findOne().sort({ id: -1 }).lean();
    const newId = last ? last.id + 1 : 1;
    const newProduct = { ...productData, id: newId };
    return await productModel.create(newProduct);
  }

  // PUT
  async updateProduct(id, updates) {
    delete updates.id; // no permitimos modificar el id
    const updated = await productModel.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return { error: "Producto no encontrado" };
    return updated;
  }

  // DELETE
  async deleteProduct(id) {
    const deleted = await productModel.findByIdAndDelete(id);
    if (!deleted) return { error: "Producto no encontrado" };
    return { message: "Producto eliminado exitosamente" };
  }
}

export default ProductManager;
