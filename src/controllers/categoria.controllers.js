import {getConnection} from '../database/connection.js'

export const getCategorias = async (req, res) => {

    const pool = await getConnection()

    const result = await pool
        .request()
        .query("SELECT id_categoria, nombre FROM Categoria")

    res.json(result.recordset)

}