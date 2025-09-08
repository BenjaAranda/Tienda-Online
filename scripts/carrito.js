// Definimos el objeto de compras
const carrito = [
    { nombre: "Catan", unidades: 1, precioUnitario: 20000 },
    { nombre: "Mando Gamer", unidades: 2, precioUnitario: 10000 },
    { nombre: "gato", unidades: 10, precioUnitario: 2000 },
    { codigo: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", precioUnitario: 29990, unidades: 1 },
    { codigo: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precioUnitario: 24990, unidades: 1 },
    { codigo: "AC001", categoria: "Accesorios", nombre: "Controlador Xbox Series X", precioUnitario: 59990, unidades: 1 },
];



const listaCarrito = document.getElementById("listaCarrito");
const totalElement = document.getElementById("total");

function agregarCarrito(productoNuevo) {
  const productoEnCarrito = carrito.find(p => p.codigo === productoNuevo.codigo || p.nombre === productoNuevo.nombre);

  if (productoEnCarrito) {
    productoEnCarrito.unidades += 1;
  } else {
    carrito.push({ ...productoNuevo, unidades: productoNuevo.unidades || 1 });
  }

  console.log("Carrito actualizado:", carrito);
}

// Función para mostrar los productos
function mostrarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("item-carrito");

        item.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>
              <span class="texto-label">Unidades:</span> 
              <span class="texto-valor">${producto.unidades}</span>
              <button class="btn-carrito accion" onclick="cambiarUnidades(${index}, 1)">➕</button>
              <button class="btn-carrito accion" onclick="cambiarUnidades(${index}, -1)">➖</button>
              <button class="btn-carrito eliminar" onclick="eliminarProducto(${index})">🗑️</button>
            </p>
            <p>
              <span class="texto-label">Precio Unitario:</span> 
              <span class="texto-valor">$${producto.precioUnitario.toLocaleString()}</span>
            </p>
            <p>
              <span class="texto-label">Subtotal:</span> 
              <span class="texto-valor">$${(producto.unidades * producto.precioUnitario).toLocaleString()}</span>
            </p>
        `;

        listaCarrito.appendChild(item);

        total += producto.unidades * producto.precioUnitario;
    });

    totalElement.innerHTML = `
        <span class="texto-label">Total:</span> 
        <span class="texto-valor">$${total.toLocaleString()}</span>
    `;
}

// Cambiar unidades (➕ o ➖)
function cambiarUnidades(index, cambio) {
    if (carrito[index].unidades + cambio > 0) {
        carrito[index].unidades += cambio;
    } else {
        carrito.splice(index, 1); // si llega a 0 se elimina
    }
    mostrarCarrito();
}

// Eliminar producto con 🗑️
function eliminarProducto(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}



// Inicializamos
mostrarCarrito();
