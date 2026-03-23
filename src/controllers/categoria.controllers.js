import { getConnection } from '../database/connection.js'

export const getCategorias = async (req, res) => {
    try {
        console.log("ENTRA A CATEGORIAS")

        const pool = await getConnection()

        const result = await pool.query("SELECT * FROM categoria")

        res.json(result.rows)

    } catch (error) {
        console.error("ERROR REAL:", error) 
        res.status(500).json({ message: "Error al obtener categorias" })
    }
}