//public/js/realtime.js
// Escucha el evento 'DOMContentLoaded' para asegurar que el DOM está completamente cargado

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const ul = document.getElementById('listaProductos');

    function renderizar(lista) {
     /*   if (!ul) {
            console.error('Error: el elemento con ID listaProductos no se encontró');
            return;
        }

        ul.innerHTML = '';
        lista.forEach(producto => {
            const li = document.createElement('li');
            li.textContent = `${producto._id} - ${producto.nombre} - $${producto.precio}`;
            li.className = 'bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-2';
            ul.appendChild(li);
        });
    }
*/
let cartId = null;

socket.emit('carrito:crear');

socket.on('carrito:creado', carrito => {
    cartId = carrito._id;
    console.log("Carrito listo:", cartId);
});

if (!ul) {
        console.error('Error: el elemento con ID listaProductos no se encontró');
        return;
    }

    ul.innerHTML = '';

    lista.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'bg-white p-3 rounded-md shadow-sm border border-gray-200 mb-2';

        // Info del producto
        const info = document.createElement('div');
        info.textContent = `${producto._id} - ${producto.nombre} - $${producto.precio}`;
        li.appendChild(info);

        // Botón para agregar al carrito
        const btn = document.createElement('button');
        btn.textContent = "Agregar al carrito";
        btn.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded ml-2';
        btn.addEventListener('click', () => {
            // Emitimos evento al servidor para agregar al carrito
            socket.emit('carrito:agregar', { productId: producto._id, cartId});
        });

        li.appendChild(btn);
        ul.appendChild(li);
    });
}
    socket.on("productos:lista", data => {
        const lista = Array.isArray(data) ? data : data.docs || [];
        console.log("Productos recibidos:", lista);
        renderizar(lista);
    });

    const formCrear = document.getElementById('formCrear');
    if (formCrear){
        formCrear.addEventListener('submit', event => {
            event.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const precio = document.getElementById('precio').value;
            socket.emit('producto:crear', { nombre, precio });
            formCrear.reset();
        });
    }

    const formEliminar = document.getElementById('formEliminar');
    if (formEliminar) {
        formEliminar.addEventListener('submit', event => {
            event.preventDefault();
            const idProducto = document.getElementById('idProducto').value;
            socket.emit('producto:eliminar', idProducto);
            formEliminar.reset();
        });
    }
});