//controllers/productosControlador.js
import {obtenerProductos} from "../services/servicioProductos.js";
import CartManager from "../managers/CartManager.js";
const cartsManager = new CartManager();

export async function mostrarInicio(req, res) {
    const productos = await obtenerProductos();
    res.render('home', {titulo:"Inicio", productos });
}
export async function mostrarTiempoReal(req, res) {
   // const productos = obtenerProductos();
    res.render('realTimeProducts', {titulo:"Productos en tiempo real" });
}
export async function mostrarProductos(req, res) {
    const productos = await obtenerProductos();

    res.render('products', { titulo: "Productos", products: productos, cartId: 1 });
}
export async function mostrarCarritos(req, res) {
    const carritos = await cartsManager.getCarts();
    res.render("carts", { titulo: "Todos los Carritos", carritos });
}

export async function mostrarCarritoPorId(req, res) {
    const { cid } = req.params;
    const cart = await cartsManager.getCartById(cid);
    console.log(cart);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("carts", { titulo: `Carrito ${cid}`, products: cart.products });
}