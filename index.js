//Entrega final
//index.jsnode 
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import "./src/basedatos.js";
import { obtenerProductos, agregarProducto, eliminarProducto } from "./src/services/servicioProductos.js"



const puerto = process.env.PORT || 8081;
const servidorHttp = http.createServer(app)
const io = new Server(servidorHttp);


// conecto socket con express
app.set("io", io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // logica de servicios
    socket.emit('productos:lista', await obtenerProductos());

    socket.on('producto:crear', async (datos) => {
        try{
        const creado = await agregarProducto(datos);
        io.emit('productos:lista', await obtenerProductos());
        socket.emit('producto:creado', creado);
        } catch (error){socket.emit('error', { mensaje: 'Error al crear producto', error });}
        
    });

    socket.on('producto:eliminar', async (idProducto) => {
        const eliminado = await eliminarProducto(idProducto);
        io.emit('productos:lista', await obtenerProductos());
        socket.emit('producto:eliminado', eliminado);
    });
});



// Se inicia el servidor HTTP 
servidorHttp.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
