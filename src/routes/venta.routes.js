import { Router } from 'express'
import { createVenta, getVentaDetalle, getVentas } from '../controllers/venta.controllers.js'

const router = Router()

router.post("/ventas", createVenta)

router.get("/ventas", getVentas)

router.get("/ventas/:id", getVentaDetalle)


export default router