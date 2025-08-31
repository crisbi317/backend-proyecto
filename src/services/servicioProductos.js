// services/servicioProductos.js
//import {getProducts, getProductsById, deleteProduct, addProduct} from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const productManager = new ProductManager('./data/products.json');
const cartsManager = new CartManager();


export function obtenerProductos() {
    return productManager.getProducts();
}
export function obtenerProductoPorId(id) {
    return productManager.getProductById(id);
}
export function eliminarProducto(id) {
    const identificador = typeof id === "string" ? Number(id) : id;
    return productManager.deleteProduct(identificador);
}
export function agregarProducto(datos) {
    const id = Date.now()
    const nombre = String(datos.nombre || "").trim();
    const precio = Number(datos.precio || 0);
    const producto = {id, nombre, precio};
    return productManager.addProduct(producto);
}


