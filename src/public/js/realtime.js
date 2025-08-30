//public/js/realtime.js
// Escucha el evento 'DOMContentLoaded' para asegurar que el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
const socket = io();
const ul = document.getElementById('listaProductos');

function renderizar(lista) {
    if (!ul) {
        console.error('Error:el elemento con ID Lista de productos no se encrontro')
        return;
    }

    ul.innerHTML = '';
    lista.forEach(producto => {
        const li = document.createElement('li');

        li.textContent = `${producto.id} - ${producto.nombre} - $${producto.precio}`;
        ul.appendChild(li);
    });
}

socket.on("productos:lista", renderizar)

const formCrear = document.getElementById('formCrear');
if (formCrear){
formCrear.addEventListener('submit', event => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    socket.emit('producto:crear', {nombre, precio});
    formCrear.reset();
});
}else {
    console.error('Error: el elemento con ID formCrear no se encontro');
}

    const formEliminar = document.getElementById('formEliminar');
    if (formEliminar) {
        formEliminar.addEventListener('submit', event => {
        event.preventDefault();
        const idProducto = document.getElementById('idProducto').value;
        socket.emit('producto:eliminar', idProducto);
        formEliminar.reset();
    });
    } else {
        console.error('Error: el elemento con ID formEliminar no se encontro');
    }
});