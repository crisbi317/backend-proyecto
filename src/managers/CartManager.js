import {promises as fs, stat} from 'fs';
import path from 'path';

import{fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
//conf __dirname en modulos
const __dirname = fileURLToPath(import.meta.url);

class CartManager {
    constructor(filePath) {
        //rutas absolutas
        this.path = path.resolve(__dirname, '..', __filename);
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch  {
            return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newId = carts.length > 0 ? carts.at(-1).id + 1 : 1;
        const newCart = {
            id: newId,
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    
    }

    //buscar carrito by id
    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    //agregar prod

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cid);
        if (!cart) return {error: 'Carrito no encontrado'};
        // filtrar por id
        const existProduct = cart.products.find(p => p.id === pid);
        if (existProduct) {
            existProduct.quantity++;
        }else {
            cart.products.push({id: pid, quantity: 1});
        }
    
    

    //guardar cambios
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}
    export default CartManager;

