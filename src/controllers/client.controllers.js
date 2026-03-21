import { getConnection } from '../database/connection.js'
import sql from 'mssql'

export const getClients = async (req, res) => {

    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM Cliente WHERE activo = 1')
    res.json(result.recordset)
}

export const getClient = async (req, res) => {
    console.log(req.params.id)

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .query('SELECT * FROM Cliente WHERE id_cliente = @id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    return res.json(result.recordset[0])
}

export const getInactiveClients = async (req,res) => {
    const pool = await getConnection()
    const result = await pool
    .request()
    .query('SELECT * FROM Cliente WHERE activo = 0')

    res.json(result.recordset)
}
export const createClient = async (req, res) => {
    console.log(req.body)

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('nombre', sql.NVarChar, req.body.nombre)
        .input('apellido', sql.NVarChar, req.body.apellido)
        .input('dni', sql.NVarChar, req.body.dni)
        .input('telefono', sql.NVarChar, req.body.telefono)
        .input('email', sql.NVarChar, req.body.email)
        .input('provincia', sql.NVarChar, req.body.provincia)
        .input('localidad', sql.NVarChar, req.body.localidad)
        .input('calle', sql.NVarChar, req.body.calle)
        .input('numero', sql.NVarChar, req.body.numero)
        .input('piso', sql.NVarChar, req.body.piso)
        .input('departamento', sql.NVarChar, req.body.departamento)
        .input('fecha_alta', sql.DateTime, req.body.fecha_alta)
        .input('activo', sql.Bit, 1)
        .query(
            'INSERT INTO Cliente (nombre, apellido, dni, telefono, email, provincia, localidad, calle, numero, piso, departamento, fecha_alta, activo) VALUES (@nombre,@apellido,@dni,@telefono,@email,@provincia,@localidad,@calle,@numero, @piso, @departamento, @fecha_alta, @activo); SELECT SCOPE_IDENTITY() AS id'
        )
    console.log(result)
    res.json({
        id: result.recordset[0].id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        telefono: req.body.telefono,
        email: req.body.email,
        provincia: req.body.provincia,
        localidad: req.body.localidad,
        calle: req.body.calle,
        numero: req.body.numero,
        piso: req.body.piso,
        departamento: req.body.departamento,
        fecha_alta: req.body.fecha_alta,
        activo: req.body.activo
    })
}
export const updateClient = async (req, res) => {
    const { id } = req.params.id;

    const pool = await getConnection()
    const result = await pool
        .request()
        .input('id', sql.Int, req.params.id)
        .input('nombre', sql.NVarChar, req.body.nombre)
        .input('apellido', sql.NVarChar, req.body.apellido)
        .input('dni', sql.NVarChar, req.body.dni)
        .input('telefono', sql.NVarChar, req.body.telefono)
        .input('email', sql.NVarChar, req.body.email)
        .input('provincia', sql.NVarChar, req.body.provincia)
        .input('localidad', sql.NVarChar, req.body.localidad)
        .input('calle', sql.NVarChar, req.body.calle)
        .input('numero', sql.NVarChar, req.body.numero)
        .input('piso', sql.NVarChar, req.body.piso)
        .input('departamento', sql.NVarChar, req.body.departamento)
        .input('fecha_alta', sql.DateTime, req.body.fecha_alta)
        .input('activo', sql.Bit, req.body.activo ?? 1)
        .query('UPDATE Cliente SET nombre = @nombre, apellido=@apellido, dni=@dni,telefono=@telefono, email=@email, provincia=@provincia, localidad=@localidad, calle=@calle, numero=@numero, piso=@piso, departamento=@departamento, fecha_alta=@fecha_alta, activo=@activo  WHERE id_cliente=@id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    res.json({
        id: req.params.id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        telefono: req.body.telefono,
        email: req.body.email,
        provincia: req.body.provincia,
        localidad: req.body.localidad,
        calle: req.body.calle,
        numero: req.body.numero,
        piso: req.body.piso,
        departamento: req.body.departamento,
        fecha_alta: req.body.fecha_alta,
        activo: req.body.activo
    })
}
export const deleteClient = async (req, res) => {

    const pool = await getConnection()

    const result = await pool.request()
        .input('id', sql.Int, req.params.id)
        .query('UPDATE Cliente SET activo = 0 WHERE id_cliente = @id')

    if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' })
    }
    return res.json({ message: 'Cliente eliminado' })

}

export const activateClient = async (req,res) => {
    const pool = await getConnection()
    await pool 
    .request()
    .input('id', sql.Int, req.params.id)
    .query('UPDATE Cliente SET activo = 1 WHERE id_cliente = @id')

    res.json({message:"Cliente activado"})
}