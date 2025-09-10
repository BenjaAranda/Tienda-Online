// admin-users.js
authProtect();

const KEY_USERS = 'usuarios';
let users = JSON.parse(localStorage.getItem(KEY_USERS)||'[]');

const usersTable = document.querySelector('#usersTable tbody');
const usersPager = document.getElementById('usersPager');
const btnNuevoUsuario = document.getElementById('btnNuevoUsuario');
const modalUser = document.getElementById('modalUser');
const closeUserModal = document.getElementById('closeUserModal');
const formUser = document.getElementById('formUser');

const u_run = document.getElementById('u_run');
const u_nombre = document.getElementById('u_nombre');
const u_apellidos = document.getElementById('u_apellidos');
const u_correo = document.getElementById('u_correo');
const u_fnac = document.getElementById('u_fnac');
const u_rol = document.getElementById('u_rol');
const u_region = document.getElementById('u_region');
const u_comuna = document.getElementById('u_comuna');
const u_direccion = document.getElementById('u_direccion');

let editingUser = null;
const PAGE = 8;
let pageNow = 1;

// regiones/comunas ejemplo (puedes ampliar)
const regiones = [
  { nombre:'Región Metropolitana', comunas:['Santiago','Providencia','Ñuñoa','Puente Alto'] },
  { nombre:'Región de Valparaíso', comunas:['Valparaíso','Viña del Mar','Quilpué'] },
  { nombre:'Región del Biobío', comunas:['Concepción','Chillán','Los Ángeles'] }
];

// init regiones select
function fillRegiones(){
  u_region.innerHTML = regiones.map(r=>`<option value="${r.nombre}">${r.nombre}</option>`).join('');
  populateComunas(0);
}
function populateComunas(idx){
  const list = regiones[idx].comunas;
  u_comuna.innerHTML = list.map(c=>`<option>${c}</option>`).join('');
}
u_region.addEventListener('change', ()=> {
  const idx = u_region.selectedIndex;
  populateComunas(idx);
});

// modal control
btnNuevoUsuario.addEventListener('click', ()=> openUserModal());
closeUserModal.addEventListener('click', ()=> closeUserModalFn());
modalUser.addEventListener('click', (e)=>{ if(e.target===modalUser) closeUserModalFn(); });

function openUserModal(edit=null){
  editingUser = edit;
  formUser.reset();
  if(edit){
    const u = users.find(x=>x.run===edit);
    if(!u) return;
    document.getElementById('userModalTitle').textContent = 'Editar Usuario';
    u_run.value = u.run; u_nombre.value = u.nombre; u_apellidos.value = u.apellidos;
    u_correo.value = u.correo; u_fnac.value = u.fnac || '';
    u_rol.value = u.rol || 'Cliente';
    u_direccion.value = u.direccion || '';
    // region/comuna
    const ridx = regiones.findIndex(r=>r.nombre===u.region);
    if(ridx>=0){ u_region.selectedIndex = ridx; populateComunas(ridx); u_comuna.value = u.comuna; }
  } else {
    document.getElementById('userModalTitle').textContent = 'Nuevo Usuario';
    u_region.selectedIndex = 0; populateComunas(0);
  }
  modalUser.setAttribute('aria-hidden','false');
}
function closeUserModalFn(){ modalUser.setAttribute('aria-hidden','true'); }

// validations
function validarRUN(run){
  if(!/^[0-9Kk]+$/.test(run)) return false;
  if(run.length <7 || run.length>9) return false;
  return true;
}
function validarCorreo(email){
  return /@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}

formUser.addEventListener('submit',(e)=>{
  e.preventDefault();
  // gather
  const run = u_run.value.trim();
  const nombre = u_nombre.value.trim();
  const apellidos = u_apellidos.value.trim();
  const correo = u_correo.value.trim();
  const fnac = u_fnac.value || '';
  const rol = u_rol.value;
  const region = u_region.value;
  const comuna = u_comuna.value;
  const direccion = u_direccion.value.trim();

  if(!validarRUN(run)){ alert('RUN inválido (solo números y K, 7-9 dígitos)'); return;}
  if(nombre.length===0 || nombre.length>50) { alert('Nombre inválido'); return; }
  if(apellidos.length===0 || apellidos.length>100) { alert('Apellidos inválidos'); return; }
  if(!validarCorreo(correo)) { alert('Correo inválido (dominios permitidos)'); return; }
  if(direccion.length===0 || direccion.length>300) { alert('Dirección inválida'); return; }

  const userObj = { run, nombre, apellidos, correo, fnac, rol, region, comuna, direccion };

  if(editingUser){
    // update existing
    const idx = users.findIndex(u=>u.run===editingUser);
    if(idx===-1){ alert('Usuario no encontrado'); closeUserModalFn(); return; }
    // si run cambió y existe otro
    if(run !== editingUser && users.some(u=>u.run===run)){ alert('RUN ya existe'); return; }
    users[idx] = userObj;
  } else {
    if(users.some(u=>u.run===run)){ alert('RUN ya existe'); return; }
    users.push(userObj);
  }

  localStorage.setItem(KEY_USERS, JSON.stringify(users));
  closeUserModalFn();
  renderUsers();
});

// eliminar/editar desde tabla
usersTable.addEventListener('click', (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if(action==='del'){ if(confirm('Eliminar usuario?')) { users = users.filter(u=>u.run!==id); localStorage.setItem(KEY_USERS, JSON.stringify(users)); renderUsers(); } }
  if(action==='edit'){ openUserModal(id); }
});

// render
function renderUsers(pageno=1){
  const start = (pageno-1)*PAGE;
  const subset = users.slice(start, start+PAGE);
  usersTable.innerHTML = subset.map(u=>`
    <tr>
      <td>${u.run}</td>
      <td>${u.nombre} ${u.apellidos}</td>
      <td>${u.correo}</td>
      <td>${u.rol}</td>
      <td>${u.region} / ${u.comuna}</td>
      <td>
        <button data-action="edit" data-id="${u.run}" class="btn">Editar</button>
        <button data-action="del" data-id="${u.run}" class="btn">Eliminar</button>
      </td>
    </tr>
  `).join('');
  renderPagerUsers(Math.ceil(users.length/PAGE), pageno);
}

function renderPagerUsers(pages, current){
  usersPager.innerHTML = '';
  if(pages<=1) return;
  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.textContent = i;
    if(i===current) b.style.background = 'linear-gradient(90deg,var(--accent),var(--neon))';
    b.addEventListener('click', ()=> renderUsers(i));
    usersPager.appendChild(b);
  }
}

// init
fillRegiones();
renderUsers();

// new user button
btnNuevoUsuario.addEventListener('click', ()=> openUserModal(null));
