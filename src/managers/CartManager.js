import CartModel from '../models/cart.model.js';

class CartManager {
  // Crear carrito
  async createCart() {
    const newCart = await CartModel.create({});
    return newCart;
  }

  // Obtener todos los carritos
  async getCarts() {
    return await CartModel.find().lean();
  }

  // Obtener carrito por id con productos completos
  async getCartById(id) {
    return await CartModel.findById(id).populate('products.product').lean();
  }

  // Agregar producto al carrito
  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado' };

    const existing = cart.products.find(p => p.product.equals(pid));
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return cart;
  }

  // Actualizar cantidad de un producto
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado' };

    const item = cart.products.find(p => p.product.equals(pid));
    if (!item) return { error: 'Producto no encontrado en el carrito' };

    item.quantity = quantity;
    await cart.save();
    return cart;
  }

  // Reemplazar todos los productos del carrito
  async updateCartProducts(cid, productsArray) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado' };

    cart.products = productsArray.map(p => ({ product: p.product, quantity: p.quantity }));
    await cart.save();
    return cart;
  }

  // Eliminar un producto del carrito
  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado' };

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();
    return cart;
  }

  // Vaciar carrito
  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return { error: 'Carrito no encontrado' };

    cart.products = [];
    await cart.save();
    return cart;
  }
}

export default CartManager;
