import {Router} from "express";

//importar cart manager
import CartManager from '../managers/CartManager.js';
// crear instancia

const router = Router();
const cartsManager = new CartManager('./src/data/carts.json');

//post

router.post('/', async(req,res) => {
    try{
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);
} catch (error) {
    res.status(500).json({error: 'Error al crear el carrito'}); 
}
});

//get
router.get('/:cid', async (req, res) => {
    const cid = req.params.cid;
   // const cart = await cartsManager.getCartById(cid);
    if (isNaN(cid)) {
       return res.status(400).json({error: 'El ID del carrito debe ser un número'});
    }
       const cart = await cartsManager.getCartById(cid);
       if (cart) {
        res.json(cart);
    }else {
        res.status(404).json({error: 'Carrito no encontrado'});}
});

//post
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    if (isNaN(cid) || isNaN(pid)) {
        return res.status(400).json({ error: 'Los IDs deben ser números' });
    }

    const result = await cartsManager.addProductToCart(cid, pid);
    if (result.error) {
        return res.status(400).json({ error: result.error });
    }
    res.json(result);
});

export default router;