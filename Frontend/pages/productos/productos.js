const baseCodigos = {
    1: "MTR",
    4: "FRN",
    2: "EEC",
    3: "STRF",
    6: "TRMS",
    7: "LBRC",
    10: "CARR",
    5: "SSDIR",
    8: "STCB",
    9: "ACCS"
};

const categoriaSelect = document.getElementById('Categoria');
const codigoInput = document.getElementById('Codigo');

let modoEditar = false;
let codigoEditando = null;
let productosGlobal = []; //array para el filtro de produtos

async function cargarProveedores(){
    const response = await fetch("https://daytona-abm.onrender.com/proveedores");
    const proveedores = await response.json();

    const select = document.getElementById("Proveedor");
    select.innerHTML = '<option value="">Seleccionar proveedor</option>';

    proveedores.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id_proveedor;
        option.textContent = p.razon_social;
        select.appendChild(option);
    });
}

async function cargarCategorias() {
    const response = await fetch("https://daytona-abm.onrender.com/categorias");
    const categorias = await response.json();

    const select = document.getElementById("Categoria");
    select.innerHTML = '<option value="">Seleccionar categoria</option>';

    categorias.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id_categoria;
        option.textContent = cat.nombre;
        select.appendChild(option);
    });
}

//se genera el codigo
categoriaSelect.addEventListener('change', () => {
    const categoriaSeleccionada = Number(categoriaSelect.value);
    codigoInput.value = baseCodigos[categoriaSeleccionada] || "";
});

async function listarProductos() {
    const response = await fetch('https://daytona-abm.onrender.com/productos');
    const productos = await response.json();

    productosGlobal = productos; 

    renderProductos(productos);
}

function renderProductos(productos) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    productos.forEach(producto => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.codigo}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.categoria ?? producto.id_categoria}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${producto.proveedor ?? producto.id_proveedor}</td>
            <td>${producto.activo}</td>
            <td>
                <button class="btn btn-info" onclick="editarProducto('${producto.id_producto}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarProducto('${producto.id_producto}')">Eliminar</button> 
            </td>
        `;

        tbody.appendChild(row);
    });
}

function filtrarProductos() {
    const texto = document.getElementById("buscadorProductos").value.toLowerCase();

    const filtrados = productosGlobal.filter(p =>
        (p.descripcion && p.descripcion.toLowerCase().includes(texto)) ||
        (p.codigo && p.codigo.toLowerCase().includes(texto)) ||
        (p.categoria && p.categoria.toLowerCase().includes(texto)) ||
        (p.proveedor && p.proveedor.toLowerCase().includes(texto))
    );

    renderProductos(filtrados);
}

async function listarProductosInactivos() {
    const response = await fetch('https://daytona-abm.onrender.com/productos/inactivos');
    const productos = await response.json();

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    productos.forEach(producto => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.codigo}</td>
            <td>${producto.descripcion}</td>
            <td>${producto.categoria ?? producto.id_categoria}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${producto.proveedor ?? producto.id_proveedor}</td>
            <td>${producto.activo}</td>
            <td>
                <button class="btn btn-info" onclick="reactivarProducto(${producto.id_producto})">
                    Reactivar
                </button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

async function guardarProducto() {
    const codigo = document.getElementById("Codigo").value.trim();
    const descripcion = document.getElementById("Descripcion").value.trim();
    const id_categoria = Number(document.getElementById("Categoria").value);
    const precio = parseFloat(document.getElementById("Precio").value);
    const stock = parseInt(document.getElementById("Stock").value);
    const id_proveedor = Number(document.getElementById("Proveedor").value);

    if (!id_categoria) return alert("Selecciona una categoría");
    if (!descripcion || isNaN(stock) || stock <= 0 || !id_proveedor)
        return alert("Completa todos los campos correctamente");

    const producto = {
        codigo,
        descripcion,
        id_categoria,
        precio,
        stock,
        id_proveedor,
    };

    try {
        let response;

        if (!modoEditar) {
            response = await fetch('https://daytona-abm.onrender.com/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        } else {
            response = await fetch(`https://daytona-abm.onrender.com/productos/${codigoEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            return alert("Error: " + errorData.message);
        }

        alert(modoEditar ? "Producto actualizado" : "Producto guardado");

        limpiarFormulario();
        listarProductos();

        modoEditar = false;
        codigoEditando = null;

    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
}

async function editarProducto(id) {
    const producto = await fetch(`https://daytona-abm.onrender.com/productos/${id}`).then(r => r.json());

    document.getElementById("Codigo").value = producto.codigo;
    document.getElementById("Descripcion").value = producto.descripcion;
    document.getElementById("Categoria").value = producto.id_categoria;
    document.getElementById("Precio").value = producto.precio;
    document.getElementById("Stock").value = producto.stock;
    document.getElementById("Proveedor").value = producto.id_proveedor;

    modoEditar = true;
    codigoEditando = id;
}

async function eliminarProducto(id) {
    if (!confirm("¿Eliminar producto?")) return;

    const response = await fetch(`https://daytona-abm.onrender.com/productos/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert("Producto eliminado");
        listarProductos();
    } else {
        alert("Error al eliminar");
    }
}

async function reactivarProducto(id){
    await fetch(`https://daytona-abm.onrender.com/productos/reactivar/${id}`, {
        method:'PUT'
    });

    alert("Producto activado");
    listarProductosInactivos();
}

function limpiarFormulario() {
    document.getElementById("Codigo").value = "";
    document.getElementById("Descripcion").value = "";
    document.getElementById("Categoria").selectedIndex = 0;
    document.getElementById("Precio").value = "";
    document.getElementById("Stock").value = "";
    document.getElementById("Proveedor").value = "";

    modoEditar = false;
    codigoEditando = null;
}

window.onload = () => {
    cargarCategorias();
    cargarProveedores();
};