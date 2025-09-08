const productos = [
  { codigo: "JM001", categoria: "Juegos de Mesa", nombre: "Catan", precio: 29990 },
  { codigo: "JM002", categoria: "Juegos de Mesa", nombre: "Carcassonne", precio: 24990 },
  { codigo: "AC001", categoria: "Accesorios", nombre: "Controlador Xbox Series X", precio: 59990 },
  { codigo: "AC002", categoria: "Accesorios", nombre: "Auriculares HyperX Cloud II", precio: 79990 },
  { codigo: "CO001", categoria: "Consolas", nombre: "PlayStation 5", precio: 549990 },
  { codigo: "CG001", categoria: "Computadores Gamers", nombre: "PC Gamer ASUS ROG Strix", precio: 1299990 },
  { codigo: "SG001", categoria: "Sillas Gamers", nombre: "Silla Gamer Secretlab Titan", precio: 349990 },
  { codigo: "MS001", categoria: "Mouse", nombre: "Mouse Logitech G502 HERO", precio: 49990 },
  { codigo: "MP001", categoria: "Mousepad", nombre: "Mousepad Razer Goliathus", precio: 29990 },
  { codigo: "PP001", categoria: "Poleras Personalizadas", nombre: "Polera Gamer 'Level-Up'", precio: 14990 },
];

// Elementos
const listaProductos = document.getElementById("listaProductos");
const ordenarSelect = document.getElementById("ordenar");
const categoriaSelect = document.getElementById("categoria");
const precioMinInput = document.getElementById("precioMin");
const precioMaxInput = document.getElementById("precioMax");
const btnFiltrar = document.getElementById("btnFiltrar");

// Renderizar productos
function renderProductos(lista) {
  listaProductos.innerHTML = "";
  lista.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <h3>${prod.nombre}</h3>
      <p><strong>Categoría:</strong> ${prod.categoria}</p>
      <p class="precio">$${prod.precio.toLocaleString("es-CL")} CLP</p>
      <button class="btn-carrito" onclick="agregarCarrito('${prod.codigo}')">Agregar al carrito</button>
    `;
    listaProductos.appendChild(card);
  });
}
function agregarCarrito(codigo) {
  const producto = productos.find(p => p.codigo === codigo);
  if (!producto) {
    alert("Producto no encontrado");
    return;
  }

  // Guardar en localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Crear ventana emergente (neón)
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.9)";
  modal.style.display = "flex";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.zIndex = "1000";

  const contenido = document.createElement("div");
  contenido.style.backgroundColor = "#111";
  contenido.style.padding = "20px";
  contenido.style.border = "2px solid #8e44ad";
  contenido.style.borderRadius = "10px";
  contenido.style.textAlign = "center";
  contenido.style.color = "#ff00ff";

  contenido.innerHTML = `
    <h2>Producto agregado</h2>
    <p>Se ha agregado <span style="color:#00ff00">${producto.nombre}</span> al carrito 🛒</p>
  `;

  const cerrar = document.createElement("button");
  cerrar.textContent = "Cerrar";
  cerrar.style.marginTop = "10px";
  cerrar.style.padding = "5px 15px";
  cerrar.style.cursor = "pointer";
  cerrar.style.backgroundColor = "#8e44ad";
  cerrar.style.color = "#fff";
  cerrar.style.border = "none";
  cerrar.style.borderRadius = "5px";
  cerrar.style.fontWeight = "bold";

  cerrar.addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  contenido.appendChild(cerrar);
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}


// Filtrar productos
function filtrarProductos() {
  let lista = [...productos];

  // Filtro categoría
  const categoria = categoriaSelect.value;
  if (categoria !== "todas") {
    lista = lista.filter(p => p.categoria === categoria);
  }

  // Filtro precio
  const min = parseInt(precioMinInput.value) || 0;
  const max = parseInt(precioMaxInput.value) || Infinity;
  lista = lista.filter(p => p.precio >= min && p.precio <= max);

  // Ordenar
  switch (ordenarSelect.value) {
    case "precioMayor":
      lista.sort((a, b) => b.precio - a.precio);
      break;
    case "precioMenor":
      lista.sort((a, b) => a.precio - b.precio);
      break;
    case "a-z":
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "z-a":
      lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
  }

  renderProductos(lista);
}

// Eventos
btnFiltrar.addEventListener("click", filtrarProductos);

// Inicial
renderProductos(productos);
