import { getConnection } from "../database/connection.js"

export const productosMasVendidos = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT 
                p.descripcion,
                SUM(dv.cantidad) AS total_vendido
            FROM detalle_venta dv
            INNER JOIN producto p
                ON dv.id_producto = p.id_producto
            GROUP BY p.descripcion
            ORDER BY total_vendido DESC
        `)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en productos más vendidos" })
    }
}


export const ventasPorMes = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT 
                EXTRACT(YEAR FROM fecha) AS anio,
                EXTRACT(MONTH FROM fecha) AS mes,
                SUM(total) AS total_vendido
            FROM venta
            GROUP BY anio, mes
            ORDER BY anio DESC, mes DESC
        `)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en ventas por mes" })
    }
}


export const totalFacturado = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT SUM(total) AS total_facturado
            FROM venta
        `)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en total facturado" })
    }
}


export const pocoStock = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT 
                descripcion,
                stock
            FROM producto
            WHERE stock <= 5
            ORDER BY stock ASC
        `)

        res.json(result.rows)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en productos con poco stock" })
    }
}