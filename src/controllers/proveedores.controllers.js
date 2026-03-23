import { getConnection } from '../database/connection.js'

export const getProviders = async (req, res) => {
    try {
        const pool = await getConnection()
        const result = await pool.query('SELECT * FROM proveedor WHERE activo = true')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener proveedores' })
    }
}

export const getInactiveProvider = async (req, res) => {
    try {
        const pool = await getConnection()
        const result = await pool.query('SELECT * FROM proveedor WHERE activo = false')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener proveedores inactivos' })
    }
}

export const getProvider = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            'SELECT * FROM proveedor WHERE id_proveedor = $1',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener proveedor' })
    }
}

export const createProvider = async (req, res) => {
    try {
        const pool = await getConnection()

        const {
            razon_social,
            cuit,
            telefono,
            email,
            provincia,
            localidad,
            calle,
            numero
        } = req.body

        const result = await pool.query(
            `INSERT INTO proveedor 
            (razon_social, cuit, telefono, email, provincia, localidad, calle, numero)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [razon_social, cuit, telefono, email, provincia, localidad, calle, numero]
        )

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al crear proveedor' })
    }
}

export const updateProvider = async (req, res) => {
    try {
        const pool = await getConnection()
        const { id } = req.params

        const {
            razon_social,
            cuit,
            telefono,
            email,
            provincia,
            localidad,
            calle,
            numero
        } = req.body

        const result = await pool.query(
            `UPDATE proveedor SET 
                razon_social=$1,
                cuit=$2,
                telefono=$3,
                email=$4,
                provincia=$5,
                localidad=$6,
                calle=$7,
                numero=$8
            WHERE id_proveedor=$9
            RETURNING *`,
            [razon_social, cuit, telefono, email, provincia, localidad, calle, numero, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' })
        }

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al actualizar proveedor' })
    }
}

export const deleteProvider = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            'UPDATE proveedor SET activo = false WHERE id_proveedor = $1 RETURNING *',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' })
        }

        res.json({ message: 'Proveedor eliminado' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar proveedor' })
    }
}

export const activateProvider = async (req, res) => {
    try {
        const pool = await getConnection()

        await pool.query(
            'UPDATE proveedor SET activo = true WHERE id_proveedor = $1',
            [req.params.id]
        )

        res.json({ message: "Proveedor activado" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al activar proveedor' })
    }
}