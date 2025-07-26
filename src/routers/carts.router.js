import {Router} from "express";

//importar cart manager
import CartManager from '../managers/CartManager.js';
// crear instancia

const router = Router();
const cartsManager = new CartManager('./src/data/carts.json');

//post

router.post('/', async(requestAnimationFrame,res) => {
    const newCart = await cartsManager.createCart();
    res.status(201).json(newCart);

})

router.get('/:id', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartsManager.getCartById(cid);
    if (cart) {
        res.json(cart.products);

    }else res.status(404).json({error: 'Carrito no encontrado'});
});

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const result = await cartManager.addProductCart(cid, pid);
    res.json(result);
});

export default router;