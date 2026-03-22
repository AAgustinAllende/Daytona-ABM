import { getConnection } from '../database/connection.js'

export const getCategorias = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.query(
            "SELECT id_categoria, nombre FROM categoria"
        )

        res.json(result.rows)

    } catch (error) {
        console.error("ERROR EN CATEGORIAS:", error)
        res.status(500).json({ message: "Error al obtener categorias" })
    }
}