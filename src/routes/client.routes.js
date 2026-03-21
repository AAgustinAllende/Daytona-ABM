import { Router } from "express";
import {   
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
    getInactiveClients,
    activateClient} from "../controllers/client.controllers.js";


const router = Router()

router.get('/clientes', getClients)
router.get('/clientes/inactivos', getInactiveClients)

router.get('/clientes/:id', getClient)


router.post('/clientes', createClient)

router.put('/clientes/reactivar/:id', activateClient)
router.put('/clientes/:id', updateClient)

router.delete('/clientes/:id', deleteClient)
export default router