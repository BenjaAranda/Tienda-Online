// admin-products.js
authProtect();

const KEY_PRODUCTS = 'productos';

// elementos
const tbody = document.querySelector('#prodTable tbody');
const searchProd = document.getElementById('searchProd');
const filterCategoria = document.getElementById('filterCategoria');
const pager = document.getElementById('pager');
const btnNuevoProducto = document.getElementById('btnNuevoProducto');

// modal
const modal = document.getElementById('modalProducto');
const formProducto = document.getElementById('formProducto');
const closeModal = document.getElementById('closeModal');
const previewImg = document.getElementById('previewImg');

// inputs modal
const f_codigo = document.getElementById('p_codigo');
const f_nombre = document.getElementById('p_nombre');
const f_descripcion = document.getElementById('p_descripcion');
const f_precio = document.getElementById('p_precio');
const f_stock = document.getElementById('p_stock');
const f_stockcrit = document.getElementById('p_stockcrit');
const f_categoria = document.getElementById('p_categoria');
const f_imagen = document.getElementById('p_imagen');
const modalTitle = document.getElementById('modalTitle');

let products = JSON.parse(localStorage.getItem(KEY_PRODUCTS)||'[]');
let editingId = null;
const PAGE_SIZE = 8;
let currentPage = 1;

function saveProducts(){ localStorage.setItem(KEY_PRODUCTS, JSON.stringify(products)); }

// Seed inicial si no hay productos
if(!products.length){
  products = [
    {codigo:'JM001', categoria:'Juegos de Mesa', nombre:'Catan', descripcion:'Juego clásico', precio:29990, stock:10, stockCritico:2, imagen:''},
    {codigo:'CO001', categoria:'Consolas', nombre:'PlayStation 5', descripcion:'PS5', precio:549990, stock:5, stockCritico:1, imagen:''},
  ];
  saveProducts();
}

// Render tabla con paginación
function renderTable(page=1, lista=null){
  const list = lista || products;
  const start = (page - 1) * PAGE_SIZE;
  const subset = list.slice(start, start + PAGE_SIZE);

  tbody.innerHTML = subset.map(p => `
    <tr>
      <td>${p.codigo}</td>
      <td>${p.nombre}</td>
      <td>${p.categoria}</td>
      <td>$${p.precio.toLocaleString('es-CL')}</td>
      <td>${p.stock}</td>
      <td>
        <button class="btn" data-action="edit" data-id="${p.codigo}">Editar</button>
        <button class="btn" data-action="del" data-id="${p.codigo}">Eliminar</button>
      </td>
    </tr>
  `).join('');

  renderPager(list.length, page);
}

// Delegación de eventos para Editar y Eliminar
tbody.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action]');
  if(!btn) return;

  const action = btn.dataset.action;
  const codigo = btn.dataset.id;

  if(action === 'del') doDelete(codigo);
  if(action === 'edit') openEdit(codigo);
});

// Renderizar pager
function renderPager(totalItems, page){
  const pages = Math.max(1, Math.ceil(totalItems/PAGE_SIZE));
  pager.innerHTML = '';
  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.textContent = i;
    if(i===page) b.style.background = 'linear-gradient(90deg,var(--accent),var(--neon))';
    b.addEventListener('click', ()=>{ currentPage = i; applyFilters(); });
    pager.appendChild(b);
  }
}

// Abrir modal nuevo producto
btnNuevoProducto.addEventListener('click', openModalNew);
closeModal.addEventListener('click', closeModalFn);
modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModalFn(); });

// Preview imagen
f_imagen.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if(!file) { previewImg.innerHTML=''; return;}
  const reader = new FileReader();
  reader.onload = ()=> previewImg.innerHTML = `<img src="${reader.result}" alt="preview">`;
  reader.readAsDataURL(file);
});

// Abrir modal nuevo
function openModalNew(){
  editingId = null;
  modalTitle.textContent = 'Nuevo Producto';
  formProducto.reset();
  previewImg.innerHTML = '';
  modal.setAttribute('aria-hidden','false');
}

// Cerrar modal
function closeModalFn(){
  modal.setAttribute('aria-hidden','true');
}

// Abrir modal editar
function openEdit(codigo){
  const p = products.find(x=>x.codigo===codigo);
  if(!p) return alert('No encontrado');
  editingId = codigo;
  modalTitle.textContent = 'Editar Producto';
  f_codigo.value = p.codigo;
  f_nombre.value = p.nombre;
  f_descripcion.value = p.descripcion||'';
  f_precio.value = p.precio;
  f_stock.value = p.stock;
  f_stockcrit.value = (p.stockCritico!=null?p.stockCritico:'');
  f_categoria.value = p.categoria;
  previewImg.innerHTML = p.imagen? `<img src="${p.imagen}" alt="img">` : '';
  modal.setAttribute('aria-hidden','false');
}

// Eliminar producto
function doDelete(codigo){
  if(!confirm('¿Eliminar producto?')) return;
  products = products.filter(p=>p.codigo!==codigo);
  saveProducts();
  applyFilters();
}

// Validar formulario producto
function validarProducto(){
  const codigo = f_codigo.value.trim();
  const nombre = f_nombre.value.trim();
  const precio = parseFloat(f_precio.value);
  const stock = parseInt(f_stock.value);
  if(codigo.length<3) return 'Código mínimo 3 caracteres';
  if(!nombre || nombre.length>100) return 'Nombre requerido (máx 100)';
  if(isNaN(precio) || precio<0) return 'Precio inválido (>=0)';
  if(!Number.isInteger(stock) || stock<0) return 'Stock inválido (entero >=0)';
  const sc = f_stockcrit.value.trim();
  if(sc !== '' && (!Number.isInteger(Number(sc)) || Number(sc) < 0)) return 'Stock crítico debe ser entero >=0';
  return null;
}

// Submit modal
formProducto.addEventListener('submit', (e)=>{
  e.preventDefault();
  const err = validarProducto();
  if(err){ alert(err); return; }

  const producto = {
    codigo: f_codigo.value.trim(),
    nombre: f_nombre.value.trim(),
    descripcion: f_descripcion.value.trim(),
    precio: parseFloat(f_precio.value),
    stock: parseInt(f_stock.value),
    stockCritico: f_stockcrit.value.trim()===''? null : parseInt(f_stockcrit.value),
    categoria: f_categoria.value,
    imagen: ''
  };

  // si imagen cargada -> convertir base64
  const file = f_imagen.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ()=>{ producto.imagen = reader.result; persistProduct(producto); };
    reader.readAsDataURL(file);
  } else {
    if(editingId){
      const existing = products.find(p=>p.codigo===editingId);
      if(existing) producto.imagen = existing.imagen || '';
    }
    persistProduct(producto);
  }
});

// Guardar o actualizar producto
function persistProduct(prod){
  if(editingId){
    const idx = products.findIndex(p=>p.codigo===editingId);
    if(idx===-1){ alert('No encontrado'); closeModalFn(); return; }

    if(prod.codigo !== editingId && products.some(p=>p.codigo===prod.codigo)){
      alert('El código ya existe. Use otro.');
      return;
    }

    products[idx] = prod;
  } else {
    if(products.some(p=>p.codigo===prod.codigo)){ alert('Código ya existe'); return; }
    products.push(prod);
  }
  saveProducts();
  closeModalFn();
  applyFilters();
}

// Filtros y búsqueda
function applyFilters(){
  let list = [...products];
  const q = (searchProd.value||'').trim().toLowerCase();
  const cat = filterCategoria.value;
  if(cat && cat!=='todas') list = list.filter(p=>p.categoria === cat);
  if(q) list = list.filter(p=> p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
  renderTable(currentPage, list);
}

// Eventos filtros
searchProd.addEventListener('input', ()=>{ currentPage = 1; applyFilters(); });
filterCategoria.addEventListener('change', ()=>{ currentPage=1; applyFilters(); });

// Inicio
applyFilters();
