const API_PRODUCTOS = "http://localhost:3000/productos";
const API_CLIENTES = "http://localhost:3000/clientes";
const API_VENTAS = "http://localhost:3000/ventas";

let carrito = [];


async function cargarClientes() {
    const res = await fetch(API_CLIENTES);
    const data = await res.json();

    const select = document.getElementById("cliente");

    data.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id_cliente;
        option.textContent = c.nombre;
        select.appendChild(option);
    });
}

async function cargarProductos() {
    const res = await fetch(API_PRODUCTOS);
    const data = await res.json();

    const select = document.getElementById("producto");

    data.forEach(p => {
        const option = document.createElement("option");
        option.value = p.id_producto;
        option.textContent = `${p.descripcion} - $${p.precio}`;
        option.dataset.precio = p.precio;
        option.dataset.stock = p.stock;

        select.appendChild(option);
    });
}


function agregarProducto() {
    const select = document.getElementById("producto");
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!cantidad || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }

    const id_producto = select.value;
    const descripcion = select.options[select.selectedIndex].text;
    const precio = parseFloat(select.options[select.selectedIndex].dataset.precio);
    const stock = parseInt(select.options[select.selectedIndex].dataset.stock);

    if (cantidad > stock) {
        alert("No hay suficiente stock");
        return;
    }

    const existente = carrito.find(p => p.id_producto == id_producto);

    if (existente) {
        existente.cantidad += cantidad;

        if (existente.cantidad > stock) {
            alert("Stock superado");
            existente.cantidad -= cantidad;
            return;
        }

        existente.subtotal = existente.cantidad * existente.precio;
    } else {
        carrito.push({
            id_producto,
            descripcion,
            cantidad,
            precio,
            subtotal: cantidad * precio
        });
    }

    document.getElementById("cantidad").value = "";
    renderCarrito();
}


function renderCarrito() {
    const tbody = document.getElementById("detalle");
    tbody.innerHTML = "";

    let total = 0;

    carrito.forEach((p, index) => {
        total += p.subtotal;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${p.descripcion}</td>
            <td>
                ${p.cantidad}
            </td>
            <td>${p.precio}</td>
            <td>${p.subtotal}</td>
            <td>
                <button class="btn btn-info" onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });

    document.getElementById("total").textContent = total;
}


function eliminarProducto(index) {
    carrito.splice(index, 1);
    renderCarrito();
}


async function guardarVenta() {
    const id_cliente = document.getElementById("cliente").value;

    if (!id_cliente) {
        alert("Seleccioná un cliente");
        return;
    }

    if (carrito.length === 0) {
        alert("Agregá productos");
        return;
    }

    const venta = {
        id_cliente,
        productos: carrito.map(p => ({
            id_producto: parseInt(p.id_producto),
            cantidad: p.cantidad
        }))
    };

    const res = await fetch(API_VENTAS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(venta)
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert("Venta realizada correctamente");

    carrito = [];
    renderCarrito();
}


cargarClientes();
cargarProductos();

function historialVentas() {
    window.location.href="ventas-detalle.html"
}