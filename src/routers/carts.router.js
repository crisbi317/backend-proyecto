// src/routers/carts.router.js
import { Router } from 'express';
//importar cart manager
import CartManager from '../managers/CartManager.js';
// crear instancia

const router = Router();
const cartsManager = new CartManager();

//post 
router.post('/', async(req,res) => {
    try{
        const newCart = await cartsManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({error: 'Error al crear el carrito'}); 
    }
});

// Listar todos los carritos
router.get('/', async (req, res) => {
    try {
        const carritos = await cartsManager.getCarts();

        if (!carritos.length) {
            return res.render('carts', { titulo: 'Carritos', carritos: [] });
        }

        res.render('carts', { titulo: 'Carritos', carritos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});
//get por id
router.get('/:cid', async (req, res) => {
    try{
        const {cid} = req.params;
        const cart = await cartsManager.getCartById(cid);
        
        
        if (!cart) {
            return res.status(404).json({error: 'Carrito no encontrado'});
        }
        
        res.render('carts', { ttitulo: `Carrito ${cart.id}`, products: cart.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener el carrito'});
    }
});

//post - Agrega un producto a un carrito

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    
    
    if (isNaN(Number(cid)) || isNaN(Number(pid))) {
        return res.status(400).json({ error: 'Los IDs deben ser números' });
    }

    try {
        const result = await cartsManager.addProductToCart(cid, pid);
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        
        // Redirige al usuario 
        res.redirect(`/api/carts/${cid}`); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

export default router;

