import sql from 'mssql'
import { getConnection } from "../database/connection.js"

export const createVenta = async (req,res) => {
    const {id_cliente, productos} = req.body
    const pool = await getConnection()
    const transaction = new sql.Transaction(pool)

    try {
        await transaction.begin()
        const request = new sql.Request(transaction)
        let total = 0

        //CREAR VENTA VACIA
        const ventaResult = await request
        .input('id_cliente', sql.Int, id_cliente)
        .input('total',sql.Decimal(10,2),0)
        .query(`
            INSERT INTO Venta (id_cliente, total)
            VALUES (@id_cliente, @total)
            SELECT SCOPE_IDENTITY() AS id
            `)

        const id_venta = ventaResult.recordset[0].id 

        //RECORRER PRODS
        for (let item of productos) {
            const productData = await new sql.Request(transaction)
            .input('id_producto', sql.Int, item.id_producto)
            .query(`
                SELECT precio,stock
                FROM producto
                WHERE id_producto = @id_producto AND activo = 1
                `)

                if(productData.recordset.length === 0) {
                    throw new Error ("Producto no encontrado")
                }

                const { precio, stock } = productData.recordset[0]

                if (stock < item.cantidad ) {
                    throw new Error ("Stock insuficiente")
                }

                const subtotal = precio * item.cantidad 
                total += subtotal

                //INSERTAR DETALLE

                await new sql.Request(transaction)
                .input('id_venta', sql.Int, id_venta)
                .input('id_producto', sql.Int, item.id_producto)
                .input('cantidad', sql.Int, item.cantidad)
                .input('precio_unitario', sql.Decimal(10,2), precio)
                .input('subtotal', sql.Decimal(10,2), subtotal)
                .query(`
                    INSERT INTO Detalle_Venta
                    (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                    VALUES
                    (@id_venta, @id_producto, @cantidad, @precio_unitario, @subtotal)
                `)

                //DESCONTAR STOCK
                await new sql.Request(transaction)
                .input('id_producto', sql.Int, item.id_producto)
                .input('cantidad', sql.Int, item.cantidad)
                .query(`
                    UPDATE Producto
                    SET stock = stock - @cantidad
                    WHERE id_producto = @id_producto
                    `)
                    
        }

        //ACTUALIZAR TOTAL FINAL
        await new sql.Request(transaction)
        .input('id_venta', sql.Int, id_venta)
        .input('total', sql.Decimal(10,2), total)
        .query(`
            UPDATE Venta
            SET total = @total
            WHERE id_venta =@id_venta
            `)
        
         await transaction.commit()
         
         res.json({
            message:"Venta realizada correctamente",
            id_venta,
            total
         })

    } catch (error) {
        await transaction.rollback()
        res.status(500).json({
            message:error.message
        })
    }
}

export const getVentas = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query(`
        SELECT
        v.id_venta,
        c.nombre AS cliente,
        v.fecha,
        v.total
        FROM Venta v
        LEFT JOIN Cliente c ON v.id_cliente = c.id_cliente
        `)

        res.json(result.recordset)
}

export const getVentaDetalle = async (req,res) => {
    const pool = await getConnection()

    const result = await pool.request()
    .input('id', sql.Int, req.params.id)
    .query(`
        SELECT 
        p.descripcion AS producto,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal
        FROM Detalle_Venta dv
        INNER JOIN Producto p
        ON dv.id_producto = p.id_producto
        WHERE dv.id_venta = @id
        `)

        res.json(result.recordset)
}