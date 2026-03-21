import { Router } from "express";
import {
    activateProduct,
    createProduct,
    deleteProduct,
    getInactiveProducts,
    getProduct,
    getProducts,
    updateProduct } from "../controllers/products.controllers.js";
import { getCategorias } from "../controllers/categoria.controllers.js";


const router = Router()

router.get('/productos', getProducts)
router.get('/productos/inactivos', getInactiveProducts)

router.get('/productos/:id', getProduct)

router.post('/productos', createProduct)
router.get('/categorias', getCategorias)
router.put('/productos/reactivar/:id', activateProduct)

router.put('/productos/:id', updateProduct)

router.delete('/productos/:id', deleteProduct)
export default router