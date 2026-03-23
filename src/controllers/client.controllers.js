import { pool } from '../database/connection.js'

export const getClients = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente WHERE activo = true')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener clientes' })
    }
}

export const getClient = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM cliente WHERE id_cliente = $1',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener cliente' })
    }
}


export const getInactiveClients = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cliente WHERE activo = false')
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al obtener clientes inactivos' })
    }
}

export const createClient = async (req, res) => {
    try {
        const {
            nombre, apellido, dni, telefono, email,
            provincia, localidad, calle, numero,
            piso, departamento
        } = req.body

        const result = await pool.query(
            `INSERT INTO cliente 
            (nombre, apellido, dni, telefono, email, provincia, localidad, calle, numero, piso, departamento)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *`,
            [nombre, apellido, dni, telefono, email, provincia, localidad, calle, numero, piso, departamento]
        )

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al crear cliente' })
    }
}

export const updateClient = async (req, res) => {
    try {
        const { id } = req.params

        const {
            nombre, apellido, dni, telefono, email,
            provincia, localidad, calle, numero,
            piso, departamento, activo
        } = req.body

        const result = await pool.query(
            `UPDATE cliente SET 
                nombre=$1, apellido=$2, dni=$3, telefono=$4, email=$5,
                provincia=$6, localidad=$7, calle=$8, numero=$9,
                piso=$10, departamento=$11, activo=$12
            WHERE id_cliente=$13
            RETURNING *`,
            [nombre, apellido, dni, telefono, email,
             provincia, localidad, calle, numero,
             piso, departamento, activo ?? true, id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.json(result.rows[0])

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al actualizar cliente' })
    }
}


export const deleteClient = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE cliente SET activo = false WHERE id_cliente = $1 RETURNING *',
            [req.params.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' })
        }

        res.json({ message: 'Cliente eliminado' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al eliminar cliente' })
    }
}

export const activateClient = async (req, res) => {
    try {
        await pool.query(
            'UPDATE cliente SET activo = true WHERE id_cliente = $1',
            [req.params.id]
        )

        res.json({ message: "Cliente activado" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al activar cliente' })
    }
}