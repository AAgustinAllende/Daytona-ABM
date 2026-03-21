import express from 'express'
import cors from 'cors'
import clientRoutes from './routes/client.routes.js'
import providerRoutes from './routes/proveedor.routes.js'
import productRoutes from './routes/products.routes.js'
import ventaRoutes from './routes/venta.routes.js'
import estadisticas from './routes/estadisticas.routes.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(clientRoutes)
app.use(providerRoutes)
app.use(productRoutes)
app.use(ventaRoutes)
app.use(estadisticas)

app.get('/', (req, res) => {
    res.send('API funcionando');
});

export default app
