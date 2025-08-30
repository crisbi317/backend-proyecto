//segunda entrega
//index.js
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import {obtenerProductos, agregarProducto, eliminarProducto} from "./src/services/servicioProductos.js"

const puerto = process.env.PORT || 8081;

const servidorHttp = http.createServer(app)
const io = new Server(servidorHttp);

//conecto socket con express
app.set("io", io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    //logica de servicios
    socket.emit('productos:lista', await obtenerProductos());

    socket.on('producto:crear', async (datos) => {

        const creado = await agregarProducto(datos);

        io.emit('productos:lista', await obtenerProductos());
        socket.emit('producto:creado', creado);
    });

    socket.on('producto:eliminar', async (idProducto) => {
        const eliminado = await eliminarProducto(idProducto);
        io.emit('productos:lista', await obtenerProductos());
        socket.emit('producto:eliminado', eliminado);
    });

    
});

servidorHttp.listen(puerto, () => console.log(`Servidor escuchando en http://localhost:${puerto}`));