//app.js
import express from 'express';
import{engine} from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { crearRouterVistas } from './routers/vistasRouter.js';
import productRouter from './routers/products.router.js';
import cartsRouter from './routers/carts.router.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
//const PORT = 8080;


//midlewares para formularios
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


//condiguracion de archivos staticos
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));  

//configuracion handlebars

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));//indica las carpetas de vistas

//rutas de vistas
app.use("/", crearRouterVistas()); 

//rutas

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

export default app;
