import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartsManager = new CartManager();

// Crear carrito
router.post('/', async (req, res) => {
  const newCart = await cartsManager.createCart();
  res.status(201).json(newCart);
});

// Obtener todos los carritos
router.get('/', async (req, res) => {
  const carritos = await cartsManager.getCarts();
  res.render('carts', { titulo: 'Carritos', carritos });
});

// Obtener carrito por id
router.get('/:cid', async (req, res) => {
  const cart = await cartsManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.render('carts', { titulo: `Carrito ${cart._id}`, products: cart.products });
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const cart = await cartsManager.addProductToCart(req.params.cid, req.params.pid);
  res.redirect(`/api/carts/${req.params.cid}`);
});

// Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartsManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
  res.json(cart);
});

// Reemplazar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  const { products } = req.body;
  const cart = await cartsManager.updateCartProducts(req.params.cid, products);
  res.json(cart);
});

// Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  const cart = await cartsManager.deleteProductFromCart(req.params.cid, req.params.pid);
  res.json(cart);
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  const cart = await cartsManager.clearCart(req.params.cid);
  res.json(cart);
});

export default router;
