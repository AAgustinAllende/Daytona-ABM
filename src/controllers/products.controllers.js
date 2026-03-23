import { getConnection } from '../database/connection.js'

export const getProducts = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT 
                p.id_producto,
                p.codigo,
                p.descripcion,
                c.nombre AS categoria,
                pr.razon_social AS proveedor,
                p.precio,
                p.stock,
                p.activo
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.activo = true
        `)

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener productos' })
    }
}

export const getProduct = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            'SELECT * FROM producto WHERE id_producto = $1',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener producto' })
    }
}

export const getInactiveProducts = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(`
            SELECT 
                p.id_producto,
                p.codigo,
                p.descripcion,
                c.nombre AS categoria,
                pr.razon_social AS proveedor,
                p.precio,
                p.stock,
                p.activo
            FROM producto p
            JOIN categoria c ON p.id_categoria = c.id_categoria
            JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
            WHERE p.activo = false
        `)

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener productos inactivos' })
    }
}

export const createProduct = async (req, res) => {
    try {
        const {
            descripcion,
            precio,
            stock,
            id_categoria,
            id_proveedor
        } = req.body

        const pool = await getConnection()

        const prefijoResult = await pool.query(
            'SELECT prefijo FROM categoria WHERE id_categoria = $1',
            [id_categoria]
        )

        const prefijo = prefijoResult.rows[0].prefijo

        const ultimoProducto = await pool.query(
            `SELECT codigo 
             FROM producto 
             WHERE id_categoria = $1
             ORDER BY id_producto DESC
             LIMIT 1`,
            [id_categoria]
        )

        let numero = 0

        if (ultimoProducto.rows.length > 0) {
            const codigoActual = ultimoProducto.rows[0].codigo
            const partes = codigoActual.split("-")
            const ultimoNumero = parseInt(partes[1], 10)

            if (!isNaN(ultimoNumero)) {
                numero = ultimoNumero + 1
            }
        }

        const codigoGenerado = `${prefijo}-${numero.toString().padStart(4, '0')}`

        const result = await pool.query(
            `INSERT INTO producto 
            (codigo, descripcion, precio, stock, id_categoria, id_proveedor)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [codigoGenerado, descripcion, precio, stock, id_categoria, id_proveedor]
        )

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al crear producto' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const pool = await getConnection()
        const { id } = req.params

        const {
            codigo,
            descripcion,
            precio,
            stock,
            id_categoria,
            id_proveedor
        } = req.body

        const result = await pool.query(
            `UPDATE producto SET 
                codigo=$1,
                descripcion=$2,
                precio=$3,
                stock=$4,
                id_categoria=$5,
                id_proveedor=$6
            WHERE id_producto=$7
            RETURNING *`,
            [codigo, descripcion, precio, stock, id_categoria, id_proveedor, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al actualizar producto' })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            'UPDATE producto SET activo = false WHERE id_producto = $1 RETURNING *',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }

        res.json({ message: 'Producto eliminado' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar producto' })
    }
}

export const activateProduct = async (req, res) => {
    try {
        const pool = await getConnection()

        await pool.query(
            'UPDATE producto SET activo = true WHERE id_producto = $1',
            [req.params.id]
        )

        res.json({ message: "Producto activado" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al activar producto' })
    }
}