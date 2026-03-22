const API_VENTAS = "https://daytona-abm.onrender.com/ventas";

let ventasGlobal = [];
let detallesGlobal = [];


async function listarVentas() {
    const res = await fetch(API_VENTAS);
    const data = await res.json();

    ventasGlobal = data;

    renderVentas(data);
    calcularStats(data);
}

function renderVentas(ventas) {
    const tbody = document.getElementById("tablaVentas");
    tbody.innerHTML = "";

    ventas.forEach(v => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${v.id_venta}</td>
            <td>${v.cliente || 'Sin cliente'}</td>
            <td>${new Date(v.fecha).toLocaleDateString()}</td>
            <td>$${v.total}</td>
            <td>
                <button class="btn btn-info" onclick="verDetalle(${v.id_venta})">Ver</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}


async function verDetalle(id_venta) {
    const res = await fetch(`${API_VENTAS}/${id_venta}`);
    const data = await res.json();

    detallesGlobal = data;

    const tbody = document.getElementById("detalleVenta");
    tbody.innerHTML = "";

    data.forEach(d => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>$${d.precio_unitario}</td>
            <td>$${d.subtotal}</td>
        `;

        tbody.appendChild(row);
    });

    calcularRanking(data);
}

function filtrarVentas() {
    const desde = document.getElementById("fechaDesde").value;
    const hasta = document.getElementById("fechaHasta").value;

    let filtradas = ventasGlobal;

    if (desde) {
        filtradas = filtradas.filter(v => new Date(v.fecha) >= new Date(desde));
    }

    if (hasta) {
        filtradas = filtradas.filter(v => new Date(v.fecha) <= new Date(hasta));
    }

    renderVentas(filtradas);
    calcularStats(filtradas);
}

function calcularStats(ventas) {
    let total = 0;

    ventas.forEach(v => total += v.total);

    document.getElementById("totalGeneral").textContent = total;
    document.getElementById("cantidadVentas").textContent = ventas.length;
}


function calcularRanking(detalles) {
    const conteo = {};

    detalles.forEach(d => {
        if (!conteo[d.producto]) {
            conteo[d.producto] = 0;
        }
        conteo[d.producto] += d.cantidad;
    });

    const lista = document.getElementById("ranking");
    lista.innerHTML = "";

    Object.entries(conteo)
        .sort((a, b) => b[1] - a[1])
        .forEach(([producto, cantidad]) => {
            const li = document.createElement("li");
            li.textContent = `${producto} - ${cantidad} vendidos`;
            lista.appendChild(li);
        });
}


function imprimirDetalle() {
    let contenido = "<h2>Detalle de Venta</h2><ul>";

    detallesGlobal.forEach(d => {
        contenido += `<li>${d.producto} - ${d.cantidad} x $${d.precio_unitario}</li>`;
    });

    contenido += "</ul>";

    const ventana = window.open("", "", "width=600,height=600");
    ventana.document.write(contenido);
    ventana.print();
}


listarVentas();