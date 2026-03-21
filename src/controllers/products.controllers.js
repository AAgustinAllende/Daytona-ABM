import { getConnection } from '../database/connection.js'
import sql from 'mssql'

export const getProducts = async (req, res) => {

    const pool = await getConnection()

    const result = await pool.request().query(`
        SELECT 
        p.id_producto,
        p.codigo,
        p.descripcion,
        c.nombre AS categoria,
        pr.razon_social AS proveedor,
        p.precio,
        p.stock,
        p.activo
        FROM Producto p
        JOIN Categoria c ON p.id_categoria = c.id_categoria
        JOIN Proveedor pr ON p.id_proveedor = pr.id_proveedor
        WHERE p.activo = 1
    `)

    res.json(result.recordset)
}

export const getProduct = async (req, res) => {
    console.log(req.params.id)

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Producto WHERE id_producto = @id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
    return res.json(result.recordset[0])
}
export const getInactiveProducts = async (req, res) => {
    const pool = await getConnection()
    const result = await pool
        .request()
        .query('SELECT  p.id_producto, p.codigo, p.descripcion, c.nombre AS categoria, pr.razon_social AS proveedor,p.precio,           p.stock,p.activo FROM Producto p JOIN Categoria c ON p.id_categoria = c.id_categoria JOIN Proveedor pr ON p.id_proveedor = pr.id_proveedor WHERE p.activo = 0')

    res.json(result.recordset)
}
export const createProduct = async (req, res) => {

    const {
        descripcion,
        precio,
        stock,
        id_categoria,
        id_proveedor
    } = req.body

    const pool = await getConnection()

    // 1️⃣ buscar prefijo de la categoria
    const prefijoResult = await pool.request()
        .input("id_categoria", sql.Int, id_categoria)
        .query(`
            SELECT prefijo
            FROM Categoria
            WHERE id_categoria = @id_categoria
        `)

    const prefijo = prefijoResult.recordset[0].prefijo

    // 2️⃣ buscar ultimo codigo de esa categoria
    const ultimoProducto = await pool.request()
        .input("id_categoria", sql.Int, id_categoria)
        .query(`
            SELECT TOP 1 codigo
            FROM Producto
            WHERE id_categoria = @id_categoria
            ORDER BY id_producto DESC
        `)

    let numero = 0

    if (ultimoProducto.recordset.length > 0) {

        const codigoActual = ultimoProducto.recordset[0].codigo

        const partes = codigoActual.split("-")

        const ultimoNumero = parseInt(partes[1], 10)

        if (!isNaN(ultimoNumero)) {
            numero = ultimoNumero + 1
        }

    }

    // 3️⃣ generar codigo nuevo
    const codigoGenerado = `${prefijo}-${numero.toString().padStart(4, '0')}`

    // 4️⃣ insertar producto
    const result = await pool
        .request()
        .input('codigo', sql.NVarChar, codigoGenerado)
        .input('descripcion', sql.NVarChar, descripcion)
        .input('precio', sql.Decimal(10, 2), precio)
        .input('stock', sql.Int, stock)
        .input('id_categoria', sql.Int, id_categoria)
        .input('id_proveedor', sql.Int, id_proveedor)
        .query(`
            INSERT INTO Producto 
            (codigo, descripcion, precio, stock, id_categoria, id_proveedor)
            VALUES 
            (@codigo, @descripcion, @precio, @stock, @id_categoria, @id_proveedor);

            SELECT SCOPE_IDENTITY() AS id;
        `)

    res.json({
        id: result.recordset[0].id,
        codigo: codigoGenerado,
        descripcion,
        precio,
        stock,
        id_categoria,
        id_proveedor
    })
}
export const updateProduct = async (req, res) => {
    const { id } = req.params.id;

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .input('codigo', sql.NVarChar, req.body.codigo)
        .input('descripcion', sql.NVarChar, req.body.descripcion)
        .input('precio', sql.Decimal(10, 2), req.body.precio)
        .input('stock', sql.Int, req.body.stock)
        .input('id_categoria', sql.Int, req.body.id_categoria)
        .input('id_proveedor', sql.Int, req.body.id_proveedor)
        .query('UPDATE Producto SET codigo = @codigo, descripcion=@descripcion,precio=@precio, stock=@stock, id_categoria=@id_categoria, id_proveedor=@id_proveedor WHERE id_producto=@id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
    res.json({
        id: req.params.id,
        codigo: req.body.codigo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock,
        id_categoria: req.body.id_categoria,
        id_proveedor: req.body.id_proveedor
    })
}
export const deleteProduct = async (req, res) => {

    const pool = await getConnection()

    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('UPDATE Producto SET activo =0 WHERE id_producto = @id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }
    return res.json({ message: 'Producto eliminado' })

}
export const activateProduct = async (req, res) => {
    const pool = await getConnection()
    await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query('UPDATE Producto SET activo = 1 WHERE id_producto = @id')

    res.json({ message: "Producto activado" })
}