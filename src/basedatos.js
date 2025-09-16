import mongoose from 'mongoose';
mongoose.connect("mongodb+srv://crisBi:1234@productosdb.99sc3so.mongodb.net/?retryWrites=true&w=majority&appName=productosDB")
    .then(() => {
        console.log("conexion exitosa");
    })
    .catch(error => {
        console.error("no se conecto", error)
    });
