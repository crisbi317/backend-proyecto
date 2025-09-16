import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import productModel from "../models/product.model.js";
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/*
 GET 
 Paginación + filtros + ordenamiento
 */
router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    // Filtros dinámicos
    let filter = {};
    if (query) {
      if (query === "disponibles") {
        filter.status = true;
      } else {
        filter.category = query;
      }
    }

    // Ordenamiento
    let sortOption = {};
    if (sort === "asc") sortOption.precio = 1;
    if (sort === "desc") sortOption.precio = -1;

    // Paginación
    const result = await productModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Error al obtener productos" });
  }
});

/*
  GET /:pid
 */
router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * POST/products
 */
router.post("/", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, precio, category, status } = req.body;
    if (!nombre || !precio) {
      return res.status(400).json({ error: "Faltan datos requeridos (nombre o precio)" });
    }

    const productData = {
      nombre,
      precio,
      category,
      status,
      imagen: req.file ? "/uploads/" + req.file.filename : null
    };

    const nuevo = await productManager.addProduct(productData);
    res.json({ status: "success", payload: nuevo });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

/**
 * PUT /:pid
 */
router.put("/:pid", async (req, res) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (updated.error) {
      return res.status(404).json(updated);
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
/*
 DELETE /:pid
 */
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productModel.findByIdAndDelete(req.params.pid);
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
