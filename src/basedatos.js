import mongoose from 'mongoose';

   mongoose.connect("mongodb+srv://crisBi:1234@productosdb.99sc3so.mongodb.net/productosDB")
.then(() => {
        console.log("conexion exitosa");
    })
    .catch(error => {
        console.error("no se conecto", error)
    });
   

mongoose.connection.on("error", (err) => {
    console.error("Error en la conexión de MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Conexión a MongoDB cerrada");
});