import {Router} from 'express';
import multer from 'multer';
import path from 'path';
import ProductManager from '../managers/ProductManager.js';


const router = Router();

const productManager = new ProductManager();

// Configurar multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage }); // Instancia de multer

// GET
router.get('/', async(req, res) => {
    try {
        const products = await productManager.getProductById();
       console.log('Productos cargados:', products);
      
      res.render('products', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET: Obtener producto por ID
router.get('/:pid', async(req, res) => {
    try{
        const product = await productManager.getProductById(req.params.pid);
    if (!product) {
        return res.status(404).json({error: 'Producto no encontrado'});
    }
    res.json(product);
} catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST: Crear
router.post('/', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        
        // Verifica 
        if (!nombre || !precio) {
            return res.status(400).json({ error: 'Faltan datos requeridos (nombre o precio)' });
        }

        const productData = {
            nombre,
            precio,
            imagen: req.file ? '/uploads/' + req.file.filename : null
        };
        
        await productManager.addProduct(productData);
        res.redirect('/products'); 
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT: Actualizar un producto
router.put('/:pid', async (req, res) => {
    try{
    
    const updated = await productManager.updateProduct(req.params.pid, req.body);
        
    if (updated.error) {
        return res.status(404).json(updated);
    }
    res.json(updated);
} catch (error){
    res.status(500).json({error: 'Error interno del servidor'});
}
});

// DELETE: Eliminar un producto
router.delete('/:pid', async (req, res) => {
   try{ const deleted = await productManager.deleteProduct(Number(req.params.pid));
    if (deleted.error) {
        return res.status(404).json(deleted);
    }
    res.json(deleted);
} catch (error){
    res.status(500).json({error: 'Error interno del servidor'});
}});

export default router;
