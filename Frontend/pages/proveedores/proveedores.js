const API_URL = 'https://daytona-abm.onrender.com/proveedores'

let modoEditar = false;
let idEditando = null;
let proveedoresGlobal = []; // array del filtro


async function listarProveedores() {
    const response = await fetch(API_URL);
    const proveedores = await response.json();

    proveedoresGlobal = proveedores; //variable para filtrar la busqueda

    renderizarTabla(proveedores);
}


function renderizarTabla(proveedores) {
    const tbody = document.querySelector("#tablaProveedores tbody");
    tbody.innerHTML = "";

    proveedores.forEach(p => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.id_proveedor || ''}</td>
            <td>${p.razon_social || ''}</td>
            <td>${p.cuit || ''}</td>
            <td>${p.telefono || ''}</td>
            <td>${p.email || ''}</td>
            <td>${p.provincia || ''}</td>
            <td>${p.localidad || ''}</td>
            <td>${p.calle || ''}</td>
            <td>${p.numero || ''}</td>
            <td>${p.piso || ''}</td>
            <td>${p.departamento || ''}</td>
            <td>${p.fecha_alta || ''}</td>
            <td>${p.activo ? 'Sí' : 'No'}</td>

            <td>
                <button class="btn btn-info" onclick="editarProveedor('${p.id_proveedor}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarProveedor('${p.id_proveedor}')">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function filtrarProveedores() {
    const texto = document.getElementById("buscadorProveedor").value.toLowerCase();

    const filtrados = proveedoresGlobal.filter(p =>
        (p.razon_social || '').toLowerCase().includes(texto) ||
        (p.cuit || '').toLowerCase().includes(texto) ||
        (p.email || '').toLowerCase().includes(texto)
    );

    renderizarTabla(filtrados);
}

async function listarProveedoresInactivos() {
    const response = await fetch(`${API_URL}/inactivos`)
    const proveedores = await response.json()

    proveedoresGlobal = proveedores
    renderizarTabla(proveedores);
}

async function guardarProveedor() {
    const razon_social = document.getElementById("Razon_social").value.trim();
    const cuit = document.getElementById("CUIT").value.trim();
    const telefono = document.getElementById("Telefono").value.trim();
    const email = document.getElementById("Email").value.trim();
    const provincia = document.getElementById("Provincia").value.trim();
    const localidad = document.getElementById("Localidad").value.trim();
    const calle = document.getElementById("Calle").value.trim();
    const numero = document.getElementById("Numero").value.trim();
    const piso = document.getElementById("Piso").value.trim();
    const departamento = document.getElementById("Dpto").value.trim();
    const fecha_alta = document.getElementById("fecha_alta").value.trim();

    if (!razon_social || !cuit) {
        alert("Completa Nombre y CUIT");
        return;
    }

    const proveedor = {
        razon_social,
        cuit,
        telefono,
        email,
        provincia,
        localidad,
        calle,
        numero,
        piso,
        departamento,
        fecha_alta,
        activo: 1 
    };

    try {
        let response;

        if (!modoEditar) {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            });
        } else {
            response = await fetch(`${API_URL}/${idEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedor)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + (errorData.message || "No se pudo guardar"));
            return;
        }

        alert(modoEditar ? "Proveedor actualizado" : "Proveedor guardado");

        limpiarFormulario();
        listarProveedores();

        modoEditar = false;
        idEditando = null;

    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
}

async function editarProveedor(id) {
    const response = await fetch(`${API_URL}/${id}`);
    const p = await response.json();

    document.getElementById("Razon_social").value = p.razon_social || '';
    document.getElementById("CUIT").value = p.cuit || '';
    document.getElementById("Telefono").value = p.telefono || '';
    document.getElementById("Email").value = p.email || '';
    document.getElementById("Provincia").value = p.provincia || '';
    document.getElementById("Localidad").value = p.localidad || '';
    document.getElementById("Calle").value = p.calle || '';
    document.getElementById("Numero").value = p.numero || '';
    document.getElementById("Piso").value = p.piso || '';
    document.getElementById("Dpto").value = p.departamento || '';
    document.getElementById("fecha_alta").value = p.fecha_alta || '';

    modoEditar = true;
    idEditando = id;
}


async function eliminarProveedor(id) {
    if (!confirm("¿Eliminar proveedor?")) return;

    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    alert("Proveedor inactivado");
    listarProveedores();
}


async function reactivarProveedor(id){
    await fetch(`${API_URL}/reactivar/${id}`, { method:'PUT' });

    alert("Proveedor activado");
    listarProveedoresInactivos();
}


function limpiarFormulario() {
    document.getElementById("Razon_social").value = "";
    document.getElementById("CUIT").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Provincia").value = "";
    document.getElementById("Localidad").value = "";
    document.getElementById("Calle").value = "";
    document.getElementById("Numero").value = "";
    document.getElementById("Piso").value = "";
    document.getElementById("Dpto").value = "";
    document.getElementById("fecha_alta").value = "";

    modoEditar = false;
    idEditando = null;
}


// PROVINCIAS / LOCALIDADES

async function cargarProvincias(){
    const res = await fetch("https://apis.datos.gob.ar/georef/api/provincias");
    const data = await res.json();

    const select = document.getElementById("Provincia");

    data.provincias.forEach(p => {
        const option = document.createElement("option");
        option.value = p.nombre;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

async function cargarLocalidades(){
    const provincia = document.getElementById("Provincia").value;

    const res = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=5000`);
    const data = await res.json();

    const select = document.getElementById("Localidad");
    select.innerHTML = "";

    data.localidades.forEach(l => {
        const option = document.createElement("option");
        option.value = l.nombre;
        option.textContent = l.nombre;
        select.appendChild(option);
    });
}

document.getElementById("Provincia").addEventListener("change", cargarLocalidades);


cargarProvincias();
