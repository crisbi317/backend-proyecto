//managers/productsManager.js
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor(filePath) {
        //rutas absolutas
        this.path = path.join(__dirname, '..', filePath);
        
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, '[]', 'utf-8');
                return [];
            }
            console.error('Error al leer o parsear el archivo:', error); 
        
            throw new Error('Error al leer el archivo de productos');
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }
//duplica funcionalidad de addProduct
/*    async save(product) {   
        const productos = await this.getProducts();
        product.id = productos.length +1;
        productos.push(product);
        await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
        return product;
    }*///guardar producto

    async addProduct(productData) {
        const products = await this.getProducts();
        const newId = products.length > 0 ? products.at(-1).id + 1 : 1;
        const newProduct = {
            id: newId,
            nombre: productData.nombre,
            description: productData.descripcion,
            precio: productData.precio,
            imagen: productData.imagen || [],
            code: productData.code,
            stock: productData.stock,
            status: productData.status ?? true,
            category: productData.category
        };

        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return {error: 'no se encontro el prod'}
        delete updates.id;//elimino el id para que no se pueda modificar
        products[index] = {...products[index], ...updates};
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return products[index];
        }
        
    

    async deleteProduct(id) {
        const products = await this.getProducts();
        const initialLength = products.length;
        const updatedProducts = products.filter(p => p.id !== id);
        if (updatedProducts.length === initialLength) {
            return {error: 'Producto no encontrado'};
        }
        await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
        return {mesage:'Producto eliminado exitosamente'};
        }
         
    }  

export default ProductManager;
