//Entrega final
//index.jsnode 
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import "./src/basedatos.js";
import { obtenerProductos, agregarProducto, eliminarProducto } from "./src/services/servicioProductos.js"
import CartManager from './src/managers/CartManager.js';

const cartsManager = new CartManager();



const puerto = process.env.PORT || 8081;
const servidorHttp = http.createServer(app)
const io = new Server(servidorHttp);


// conecto socket con express
app.set("io", io);

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    const datos = await obtenerProductos();
   
    socket.emit('productos:lista',datos.docs || [] );
    
    socket.on('carrito:crear', async () => {
    const nuevoCarrito = await cartsManager.createCart();
    socket.emit('carrito:creado', nuevoCarrito);
});

    socket.on('producto:crear', async (datos) => {
        try{
        const creado = await agregarProducto(datos);
        const productosActualizados = await obtenerProductos();
        io.emit('productos:lista', productosActualizados.docs);
        socket.emit('producto:creado', creado);
        } catch (error){socket.emit('error', { mensaje: 'Error al crear producto', error });}
        
    });

    socket.on('producto:eliminar', async (idProducto) => {
        const eliminado = await eliminarProducto(idProducto);
        const productosActualizados = await obtenerProductos();
        io.emit('productos:lista', productosActualizados.docs);
        socket.emit('producto:eliminado', eliminado);
    });
    socket.on('carrito:agregar', async ({ productId, cartId }) => {
        try {
            const result = await cartsManager.addProductToCart(cartId, productId, 1);
            socket.emit('carrito:actualizado', result);
        } catch (error) {
            socket.emit('error', { mensaje: 'Error al agregar al carrito', error });
        }
    });
});



// Se inicia el servidor HTTP 
servidorHttp.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});
