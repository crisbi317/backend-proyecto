//controllers/productosControlador.js
import {obtenerProductos} from "../services/servicioProductos.js";

export async function mostrarInicio(req, res) {
    const productos = await obtenerProductos();
    res.render('home', {titulo:"Inicio", productos });
}
export async function mostrarTiempoReal(req, res) {
   // const productos = obtenerProductos();
    res.render('realTimeProducts', {titulo:"Productos en tiempo real" });
}