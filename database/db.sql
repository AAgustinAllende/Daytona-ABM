-- CREATE DATABASE Daytona

-- CREATE TABLE Cliente (
--     id_cliente INT IDENTITY(1,1) PRIMARY KEY,
--     nombre NVARCHAR(50) NOT NULL,
--     apellido NVARCHAR(50) NOT NULL,
--     dni NVARCHAR(20) NOT NULL UNIQUE,
--     telefono NVARCHAR(20),
--     email NVARCHAR(100),

--     provincia NVARCHAR(50) NOT NULL,
--     localidad NVARCHAR(50) NOT NULL,
--     calle NVARCHAR(100) NOT NULL,
--     numero NVARCHAR(10) NOT NULL,
--     piso NVARCHAR(10),
--     departamento NVARCHAR(10),

--     fecha_alta DATETIME NOT NULL DEFAULT GETDATE(),
--     activo BIT NOT NULL DEFAULT 1
-- );

-- INSERT INTO Cliente (
--   nombre, apellido, dni, telefono, email,
--   provincia, localidad, calle, numero
-- )
-- VALUES (
--   'Agustin', 'Allende', '39937874', '3512572357', 'agus.allende996@gmail.com',
--   'Cordoba', 'Cordoba', 'Francisco de Paula Rivero', '56'
-- );

-- CREATE TABLE Proveedor (
--     id_proveedor INT IDENTITY(1,1) PRIMARY KEY,

--     razon_social NVARCHAR(150) NOT NULL,
--     cuit NVARCHAR(20) NOT NULL UNIQUE,

--     telefono NVARCHAR(30),
--     email NVARCHAR(100),

--     provincia NVARCHAR(100) NOT NULL,
--     localidad NVARCHAR(100) NOT NULL,
--     calle NVARCHAR(150),
--     numero NVARCHAR(10),
--     piso NVARCHAR(10),
--     departamento NVARCHAR(10),

--     fecha_alta DATETIME NOT NULL DEFAULT GETDATE(),
--     activo BIT NOT NULL DEFAULT 1
-- );
-- CREATE TABLE Categoria (
--     id_categoria INT IDENTITY(1,1) PRIMARY KEY,
--     nombre NVARCHAR(100) NOT NULL,
--     descripcion NVARCHAR(255)
-- );
-- CREATE TABLE Producto (
--     id_producto INT IDENTITY(1,1) PRIMARY KEY,
--     codigo NVARCHAR(50),
--     descripcion NVARCHAR(255) NOT NULL,
--     precio DECIMAL(10,2) NOT NULL,
--     stock INT NOT NULL,
--     id_categoria INT NOT NULL,
--     id_proveedor INT NOT NULL,
--     activo BIT DEFAULT 1,

--     FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
--     FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
-- );


-- INSERT INTO Categoria (nombre, descripcion)
-- VALUES
-- ('Motor', 'Componentes internos y externos del motor'),
-- ('Electricidad', 'Sistema eléctrico y electrónico del vehículo'),
-- ('Iluminacion', 'Ópticas, faros y luces'),
-- ('Frenos', 'Sistema de frenado y sus componentes'),
-- ('Suspension', 'Amortiguadores, parrillas y tren delantero'),
-- ('Transmision', 'Embrague, caja y semiejes'),
-- ('Lubricantes', 'Aceites, fluidos y refrigerantes'),
-- ('Filtros', 'Filtros de aire, aceite y combustible'),
-- ('Accesorios', 'Accesorios generales del vehículo'),
-- ('Carroceria', 'Partes externas y estructurales');
-- CREATE TABLE Venta (
--     id_venta INT IDENTITY(1,1) PRIMARY KEY,
--     id_cliente INT NOT NULL,
--     fecha DATETIME DEFAULT GETDATE(),
--     total DECIMAL(10,2) NOT NULL,
--     FOREIGN KEY (id_cliente) REFERENCES Cliente (id_cliente)
-- );

-- CREATE TABLE Detalle_Venta (
--     id_detalle INT IDENTITY(1,1) PRIMARY KEY,
--     id_venta INT NOT NULL,
--     id_producto INT NOT NULL,
--     cantidad INT NOT NULL,
--     precio_unitario DECIMAL(10,2) NOT NULL,
--     subtotal DECIMAL(10,2) NOT NULL,

--     FOREIGN KEY (id_venta) REFERENCES Venta(id_venta),
--     FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
-- );
USE Daytona
-- ALTER TABLE Categoria
-- ADD prefijo NVARCHAR(10)

UPDATE Categoria SET prefijo='MTR' WHERE id_categoria = 1
UPDATE Categoria SET prefijo='EEC' WHERE id_categoria = 2
UPDATE Categoria SET prefijo='STRF' WHERE id_categoria = 3
UPDATE Categoria SET prefijo='FRN' WHERE id_categoria = 4
UPDATE Categoria SET prefijo='SSDIR' WHERE id_categoria = 5
UPDATE Categoria SET prefijo='TRMS' WHERE id_categoria = 6
UPDATE Categoria SET prefijo='LBRC' WHERE id_categoria = 7
UPDATE Categoria SET prefijo='STCB' WHERE id_categoria = 8
UPDATE Categoria SET prefijo='ACCS' WHERE id_categoria = 9
UPDATE Categoria SET prefijo='CARR' WHERE id_categoria = 10