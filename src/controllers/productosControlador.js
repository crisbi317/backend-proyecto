//controllers/productosControlador.js
import {obtenerProductos} from "../services/servicioProductos.js";
import CartManager from "../managers/CartManager.js";
const cartsManager = new CartManager();

export async function mostrarInicio(req, res) {
    const productos = await obtenerProductos();
    res.render('home', {titulo:"Inicio", productos });
}
export async function mostrarTiempoReal(req, res) {
   // const productos = obtenerProductos();
    res.render('realTimeProducts', {titulo:"Productos en tiempo real" });
}
export async function mostrarProductos(req, res) {
    try {
        const productos = await productManager.getProducts({}, { lean: true });
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        // filtro
        let filter = {};
        if (query) {
            if (query === "disponibles") filter.status = true;
            else filter.category = query;
        }

        const result = await productManager.getProducts(filter, { limit, page, sort });

        const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
        const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}` : null;
        const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}` : null;

        res.render("products", {
            products: result.docs,
            pagination: {
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                prevLink,
                nextLink
            },
            cartId: 1
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al mostrar productos");
    }

}
export async function mostrarCarritos(req, res) {
    const carritos = await cartsManager.getCarts();
    res.render("carts", { titulo: "Todos los Carritos", carritos });
}

export async function mostrarCarritoPorId(req, res) {
    const { cid } = req.params;
    const cart = await cartsManager.getCartById(cid);
    console.log(cart);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    res.render("carts", { titulo: `Carrito ${cid}`, products: cart.products });
}

export async function mostrarProductoDetalle(req, res) {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) return res.status(404).send("Producto no encontrado");
        res.render("productDetail", { product, cartId: 1 });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al mostrar detalle del producto");
    }
}