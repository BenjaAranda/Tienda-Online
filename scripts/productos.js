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

// Agregar al carrito (simulado)
function agregarCarrito(codigo) {
  alert(`Producto ${codigo} agregado al carrito 🛒`);
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
