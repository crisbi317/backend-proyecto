import { Router } from "express";
import {
  mostrarInicio,
  mostrarProductos,
  mostrarProductoDetalle,
  mostrarCarritos,
  mostrarCarritoPorId
} from "../controllers/productosControlador.js";

export function crearRouterVistas() {
  const router = Router();

  // Página de inicio
  router.get("/", mostrarInicio);

  // Listado de productos con paginación
  router.get("/products", mostrarProductos);

  // Detalle de un producto
  router.get("/products/:pid", mostrarProductoDetalle);

  // Carritos
  router.get("/carts", mostrarCarritos);

  // Carrito específico
  router.get("/carts/:cid", mostrarCarritoPorId);

  return router;
}
