import { Router } from "express";
import { pocoStock, 
    productosMasVendidos, 
    totalFacturado, 
    ventasPorMes } from "../controllers/estadisticas.controllers.js";

const router = Router()

router.get("/estadisticas/productos-mas-vendidos", productosMasVendidos)
router.get("/estadisticas/ventas-por-mes", ventasPorMes)
router.get("/estadisticas/total-facturado", totalFacturado)
router.get("/estadisticas/stock", pocoStock)

export default router