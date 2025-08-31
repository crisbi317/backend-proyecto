//routers/vistasRouter.js
import {Router} from "express";
import {mostrarInicio, mostrarTiempoReal,mostrarProductos, mostrarCarritos, mostrarCarritoPorId} from "../controllers/productosControlador.js";


export function crearRouterVistas(){
    const router = Router();
    router.get('/', mostrarInicio);
    router.get('/realtimeproducts', mostrarTiempoReal);
    router.get('/products', mostrarProductos);
    router.get('/carts', mostrarCarritos);
    router.get("/carts/:cid", mostrarCarritoPorId);
    

    return router;
}