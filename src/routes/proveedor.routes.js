import { Router } from "express";
import { getProviders, 
    getProvider, 
    createProvider, 
    updateProvider, 
    deleteProvider, 
    getInactiveProvider,
    activateProvider} from "../controllers/proveedores.controllers.js";


const router = Router()

router.get('/proveedores', getProviders)
router.get('/proveedores/inactivos', getInactiveProvider)

router.get('/proveedores/:id', getProvider)

router.post('/proveedores', createProvider)

router.put('/proveedores/reactivar/:id', activateProvider)

router.put('/proveedores/:id', updateProvider)

router.delete('/proveedores/:id', deleteProvider)
export default router