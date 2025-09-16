import { Router } from "express";
import {
  mostrarInicio,
  mostrarProductos,
  mostrarProductoDetalle,
  mostrarCarritos,
  mostrarCarritoPorId,
  mostrarTiempoReal 
} from "../controllers/productosControlador.js";

export function crearRouterVistas() {
  const router = Router();

  router.get("/", mostrarInicio);
  router.get("/products", mostrarProductos);
  router.get("/products/:pid", mostrarProductoDetalle);
  router.get("/carts", mostrarCarritos);
  router.get("/carts/:cid", mostrarCarritoPorId);

  // Ruta para productos en tiempo real
  router.get("/realTimeProducts", mostrarTiempoReal);

  return router;
}
