//routera/products.router.js
import {Router} from 'express';
import multer from 'multer';
import path from 'path';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

//configurar multer
const storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
    },
    
    filename:  (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
    }
});

const upload = multer({storage });//instancia de multer

//get
router.get('/', async(req, res) => {
try {
    const products = await productManager.getProducts();
    //res.json(products);
    res.render('products', {products});//renderiza la vista con los productos
}
    catch (error) {
    res.status(500).json({error: 'Error interno del servidor'});    
}
});

//get por id
router.get('/:pid', async(req, res)=>{
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({error : 'elemento no encontrado'});

});

//post crear un prod sin imagen
router.post('/', async (req,res) => {
    try{
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
} catch (error) {
    res.status(500).json({error: 'Error interno del servidor'});
}
});

// post crear un prod con imagen
router.post('/', upload.single('imagen'), async (req, res) => {
    const {nombre,precio} = req.body;
    const imagen = req.file ? '/uploads' + req.file.filename : null;
    if (!nombre || !precio) {
        return res.status(400).json({error: 'Faltan datos'});
    }   
     await productManager.save({nombre, precio, imagen});
    res.redirect('/products');
});

//put actualizar
router.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updated = await productManager.updateProduct(pid, req.body);
    res.json(updated);
});

//delete
router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    res.json(deleted);
});

export default router;