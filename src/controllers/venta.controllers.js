import { getConnection } from "../database/connection.js"

export const createVenta = async (req, res) => {
    const { id_cliente, productos } = req.body
    const pool = await getConnection()

    const client = await pool.connect() //  para transacciones de las ventas

    try {
        await client.query('BEGIN')

        let total = 0

        const ventaResult = await client.query(
            `INSERT INTO venta (id_cliente, total)
             VALUES ($1, $2)
             RETURNING id_venta`,
            [id_cliente, 0]
        )

        const id_venta = ventaResult.rows[0].id_venta

        for (let item of productos) {

            const productData = await client.query(
                `SELECT precio, stock 
                 FROM producto 
                 WHERE id_producto = $1 AND activo = true`,
                [item.id_producto]
            )

            if (productData.rows.length === 0) {
                throw new Error("Producto no encontrado")
            }

            const { precio, stock } = productData.rows[0]

            if (stock < item.cantidad) {
                throw new Error("Stock insuficiente")
            }

            const subtotal = precio * item.cantidad
            total += subtotal

            await client.query(
                `INSERT INTO detalle_venta
                (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                VALUES ($1,$2,$3,$4,$5)`,
                [id_venta, item.id_producto, item.cantidad, precio, subtotal]
            )

            await client.query(
                `UPDATE producto 
                 SET stock = stock - $1
                 WHERE id_producto = $2`,
                [item.cantidad, item.id_producto]
            )
        }

        await client.query(
            `UPDATE venta 
             SET total = $1 
             WHERE id_venta = $2`,
            [total, id_venta]
        )

        await client.query('COMMIT')

        res.json({
            message: "Venta realizada correctamente",
            id_venta,
            total
        })

    } catch (error) {
        await client.query('ROLLBACK')
        res.status(500).json({ message: error.message })
    } finally {
        client.release()
    }
}


export const getVentas = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT
                v.id_venta,
                c.nombre AS cliente,
                v.fecha,
                v.total
            FROM venta v
            LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
        `)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al obtener ventas" })
    }
}


export const getVentaDetalle = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            `SELECT 
                p.descripcion AS producto,
                dv.cantidad,
                dv.precio_unitario,
                dv.subtotal
            FROM detalle_venta dv
            INNER JOIN producto p
                ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = $1`,
            [req.params.id]
        )

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error al obtener detalle" })
    }
}