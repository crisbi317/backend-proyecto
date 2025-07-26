import {Router} from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();

const productManager = new ProductManager('./src/data/product.json');

//get
router.get('/', async (req, res) => {
    const products = await ProductManager.getProducts();
    res.json(products);
});

//get por id
router.get('/:pid', async(req, res)=>{
    const pid = req.params.id;
    const product = await productManager.getProductById(pid);
    product ? res.json(product) : res.status(404).json({error : 'elemento no encontrado'});

});

//post
router.post('/', async (req,res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
})

//put actualizar
router.put('/:pid', async (req, res) => {
    
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    res.json(updated);
});

//delete
router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    res.json(deleted);
});

export default router;