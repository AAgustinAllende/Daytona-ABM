import { getConnection } from "../database/connection.js"

export const productosMasVendidos = async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request().query(`
        SELECT 
        p.descripcion,
        SUM(dv.cantidad) AS total_vendido
        FROM Detalle_venta dv
        INNER JOIN Producto p
        ON dv.id_producto = p.id_producto
        GROUP BY p.descripcion
        ORDER BY total_vendido DESC
        `)
    res.json(result.recordset)
}

export const ventasPorMes = async (req, res) => {
    const pool = await getConnection()
    const result = await pool.request().query(`
        SELECT 
    YEAR(fecha) AS año,
    MONTH(fecha) AS mes,
    SUM(total) AS total_vendido
    FROM Venta
    GROUP BY YEAR(fecha), MONTH(fecha)
    ORDER BY año DESC, mes DESC
    `)
    res.json(result.recordset)
}

export const totalFacturado = async (req,res) => {
    const pool = await getConnection()
    const result = await pool.request().query(`
        SELECT SUM(total) AS total_facturado
        FROM Venta
        `)
    res.json(result.recordset)
}

export const pocoStock = async (req,res) => {
    const pool = await getConnection()
    const result = await pool.request().query(`
        SELECT 
        descripcion,
        stock
        FROM Producto
        WHERE stock <= 5
        ORDER BY stock ASC
        `)
        res.json(result.recordset)
}