//routers/vistasRouter.js
import {Router} from "express";
import {mostrarInicio, mostrarTiempoReal} from "../controllers/productosControlador.js";

export function crearRouterVistas(){
    const router = Router();
    router.get('/', mostrarInicio);
    router.get('/realtimeproducts', mostrarTiempoReal);
    return router;
}