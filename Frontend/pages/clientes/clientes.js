const API_URL = 'http://localhost:3000/clientes';

let modoEditar = false;
let idEditando = null;
let clientesGlobal = []; // array para el buscador

async function listarClientes() {
    const response = await fetch(API_URL);
    const clientes = await response.json();

    clientesGlobal = clientes; // guardamos para filtrar

    renderClientes(clientes);
}

function renderClientes(clientes) {
    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.id_cliente || ''}</td>
            <td>${c.nombre || ''}</td>
            <td>${c.apellido || ''}</td>
            <td>${c.dni || ''}</td>
            <td>${c.telefono || ''}</td>
            <td>${c.email || ''}</td>
            <td>${c.provincia || ''}</td>
            <td>${c.localidad || ''}</td>
            <td>${c.calle || ''}</td>
            <td>${c.numero || ''}</td>
            <td>${c.piso || ''}</td>
            <td>${c.departamento || ''}</td>
            <td>${c.fecha_alta || ''}</td>
            <td>${c.activo ? 'Sí' : 'No'}</td>
            <td>
                <button class="btn btn-info" onclick="editarCliente('${c.id_cliente}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarCliente('${c.id_cliente}')">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filtrarClientes() {
    const texto = document.getElementById("buscadorClientes").value.toLowerCase();

    const filtrados = clientesGlobal.filter(c =>
        (c.nombre && c.nombre.toLowerCase().includes(texto)) ||
        (c.apellido && c.apellido.toLowerCase().includes(texto)) ||
        (c.dni && c.dni.toLowerCase().includes(texto)) ||
        (c.email && c.email.toLowerCase().includes(texto))
    );

    renderClientes(filtrados);
}


async function listarClientesInactivos() {
    const response = await fetch(`${API_URL}/inactivos`);
    const clientes = await response.json();

    const tbody = document.querySelector("#tablaClientes tbody");
    tbody.innerHTML = "";

    clientes.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.id_cliente}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.dni}</td>
            <td>${c.telefono}</td>
            <td>${c.email}</td>
            <td>${c.provincia}</td>
            <td>${c.localidad}</td>
            <td>${c.calle}</td>
            <td>${c.numero}</td>
            <td>${c.piso}</td>
            <td>${c.departamento}</td>
            <td>${c.fecha_alta}</td>
            <td>No</td>
            <td>
                <button class="btn btn-info" onclick="reactivarCliente(${c.id_cliente})">Reactivar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function guardarCliente() {
    const nombre = document.getElementById("Nombre").value.trim();
    const apellido = document.getElementById("Apellido").value.trim();
    const dni = document.getElementById("DNI").value.trim();
    const telefono = document.getElementById("Telefono").value.trim();
    const email = document.getElementById("Email").value.trim();
    const provincia = document.getElementById("Provincia").value.trim();
    const localidad = document.getElementById("Localidad").value.trim();
    const calle = document.getElementById("Calle").value.trim();
    const numero = document.getElementById("Numero").value.trim();
    const piso = document.getElementById("Piso").value.trim();
    const departamento = document.getElementById("Dpto").value.trim();
    const fecha_alta = document.getElementById("fecha_alta").value.trim();

    if (!nombre || !apellido) {
        alert("Completa Nombre y Apellido");
        return;
    }

    const cliente = {
        nombre,
        apellido,
        dni,
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
                body: JSON.stringify(cliente)
            });
        } else {
            response = await fetch(`${API_URL}/${idEditando}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + (errorData.message || "No se pudo guardar"));
            return;
        }

        alert(modoEditar ? "Cliente actualizado" : "Cliente guardado");

        limpiarFormulario();
        listarClientes();

        modoEditar = false;
        idEditando = null;

    } catch (error) {
        console.error(error);
        alert("Error inesperado");
    }
}


async function editarCliente(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const c = await response.json();

        document.getElementById("Nombre").value = c.nombre || '';
        document.getElementById("Apellido").value = c.apellido || '';
        document.getElementById("DNI").value = c.dni || '';
        document.getElementById("Telefono").value = c.telefono || '';
        document.getElementById("Email").value = c.email || '';
        document.getElementById("Provincia").value = c.provincia || '';
        document.getElementById("Localidad").value = c.localidad || '';
        document.getElementById("Calle").value = c.calle || '';
        document.getElementById("Numero").value = c.numero || '';
        document.getElementById("Piso").value = c.piso || '';
        document.getElementById("Dpto").value = c.departamento || '';
        document.getElementById("fecha_alta").value = c.fecha_alta || '';

        // checkbox visual activo
        document.getElementById("flexSwitchCheckCheckedDisabled").checked = true;

        modoEditar = true;
        idEditando = id;

    } catch (error) {
        console.error(error);
        alert("Error al editar");
    }
}

async function eliminarCliente(id) {
    if (!confirm("¿Eliminar cliente?")) return;

    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    alert("Cliente inactivado");
    listarClientes();
}

async function reactivarCliente(id) {
    await fetch(`${API_URL}/reactivar/${id}`, { method: 'PUT' });

    alert("Cliente activado");
    listarClientesInactivos();
}

function limpiarFormulario() {
    document.getElementById("Nombre").value = "";
    document.getElementById("Apellido").value = "";
    document.getElementById("DNI").value = "";
    document.getElementById("Telefono").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Provincia").value = "";
    document.getElementById("Localidad").value = "";
    document.getElementById("Calle").value = "";
    document.getElementById("Numero").value = "";
    document.getElementById("Piso").value = "";
    document.getElementById("Dpto").value = "";
    document.getElementById("fecha_alta").value = "";

    document.getElementById("flexSwitchCheckCheckedDisabled").checked = true;

    modoEditar = false;
    idEditando = null;
}

async function cargarProvincias() {
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

async function cargarLocalidades() {
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
