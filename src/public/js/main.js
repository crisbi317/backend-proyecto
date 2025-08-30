//public/js/main.js
console.log('main.js');

const socket = io(); 

document.getElementById('productForm').addEventListener('submit', (event) => {event.preventDefault();
    
    const nombre = document.getElementById('nombre').value; 
    const precio = document.getElementById('precio').value;
    const producto = {nombre: nombre, precio: precio};
    agregarProducto(producto);
});

socket.on('productos:lista', (data) => {
    console.log(data);
});

function agregarProducto(e) {
    e.preventDefault(); //evita que se recargue la pagina
    
    socket.emit('producto:crear', e);
    e.target.reset(); //evita que se recargue la pagina
}
   
