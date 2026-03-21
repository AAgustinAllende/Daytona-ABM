import {getConnection} from '../database/connection.js'
import sql from 'mssql'

export const getProviders = async (req,res) => {

    const pool = await getConnection()
    const result = await pool.request().query('SELECT * FROM Proveedor WHERE activo = 1')
    res.json(result.recordset)
}
export const getInactiveProvider = async (req,res) => {
    const pool = await getConnection()
    const result = await pool
    .request()
    .query('SELECT * FROM Proveedor WHERE activo = 0')

    res.json(result.recordset)
}
export const getProvider = async (req,res) => {
    console.log(req.params.id)

    const pool = await getConnection()
    const result = await pool
    .request()
    .input('id', sql.Int, req.params.id)
    .query('SELECT * FROM Proveedor WHERE id_proveedor = @id')

    if (result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'Proveedor no encontrado'})
    }
    return res.json(result.recordset[0])
}

export const createProvider = async (req,res) => {
    console.log(req.body)

    const pool = await getConnection()
    const result = await pool
    .request()
    .input('razon_social', sql.NVarChar, req.body.razon_social)
    .input('cuit', sql.NVarChar, req.body.cuit)
    .input('telefono', sql.NVarChar, req.body.telefono)
    .input('email', sql.NVarChar, req.body.email)
    .input('provincia', sql.NVarChar, req.body.provincia)
    .input('localidad', sql.NVarChar, req.body.localidad)
    .input('calle', sql.NVarChar, req.body.calle)
    .input('numero', sql.NVarChar, req.body.numero)
    .query(
        'INSERT INTO Proveedor (razon_social, cuit, telefono, email, provincia, localidad, calle, numero) VALUES (@razon_social,@cuit,@telefono,@email,@provincia,@localidad,@calle,@numero); SELECT SCOPE_IDENTITY() AS id'
    )
    console.log(result)
    res.json({
        id:result.recordset[0].id,
        razon_social:req.body.razon_social,
        cuit:req.body.cuit,
        telefono:req.body.telefono,
        email:req.body.email,
        provincia:req.body.provincia,
        localidad:req.body.localidad,
        calle:req.body.calle,
        numero:req.body.numero
    })
}
export const updateProvider = async (req,res) => {
    const {id} = req.params.id;

    const pool=await getConnection()
    const result = await pool
    .request()
    .input('id',sql.Int,req.params.id)
    .input('razon_social', sql.NVarChar, req.body.razon_social)
    .input('cuit', sql.NVarChar, req.body.cuit)
    .input('telefono', sql.NVarChar, req.body.telefono)
    .input('email', sql.NVarChar, req.body.email)
    .input('provincia', sql.NVarChar, req.body.provincia)
    .input('localidad', sql.NVarChar, req.body.localidad)
    .input('calle', sql.NVarChar, req.body.calle)
    .input('numero', sql.NVarChar, req.body.numero)
    .query('UPDATE Proveedor SET razon_social = @razon_social, cuit=@cuit,telefono=@telefono, email=@email, provincia=@provincia, localidad=@localidad, calle=@calle, numero=@numero WHERE id_proveedor=@id')
    
    if(result.rowsAffected[0] === 0 ){
        return res.status(404).json({ message: 'Proveedor no encontrado'})
    }
    res.json({ 
        id:req.params.id,
        razon_social:req.body.razon_social,
        cuit:req.body.cuit,
        telefono:req.body.telefono,
        email:req.body.email,
        provincia:req.body.provincia,
        localidad:req.body.localidad,
        calle:req.body.calle,
        numero:req.body.numero
    })
}
export const deleteProvider = async (req,res) => {

    const pool = await getConnection()

    const result = await pool.request()
    .input('id',sql.Int, req.params.id)
    .query('UPDATE Proveedor SET activo = 0 WHERE id_proveedor = @id')

    if (result.rowsAffected[0] === 0){
        return res.status(404).json({message: 'Proveedor no encontrado'})
    }
    return res.json({message: 'Proveedor eliminado'})

}
export const activateProvider = async (req,res) => {
    const pool = await getConnection()
    await pool 
    .request()
    .input('id', sql.Int, req.params.id)
    .query('UPDATE Proveedor SET activo = 1 WHERE id_proveedor = @id')

    res.json({message:"Proveedor activado"})
}