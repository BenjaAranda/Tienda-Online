// auth.js - pequeño control de sesión admin (demo)

// credenciales demo
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// realiza login y almacena bandera en sessionStorage
function loginAdmin(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    sessionStorage.setItem('adminSession', 'true');
    return true;
  }
  return false;
}

// verifica si hay sesión activa
function isAdmin() {
  return sessionStorage.getItem('adminSession') === 'true';
}

// cerrar sesión
function logout() {
  sessionStorage.removeItem('adminSession');
  // redirige al login (archivo en la misma carpeta administracion)
  window.location.href = 'admin-login.html';
}

// proteger ruta: redirige a login si no hay sesión
function authProtect() {
  if (!isAdmin()) {
    // evita redirigir si ya estamos en la página de login (evita bucle)
    const current = window.location.pathname.split('/').pop().toLowerCase();
    if (current === '' || current === 'admin-login.html') return;
    window.location.href = 'admin-login.html';
  }
}

/* --- lógica de la página de login --- */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    // por si quieres autoseleccionar el input
    const userInput = document.getElementById('adminUser');
    const passInput = document.getElementById('adminPass');
    if (userInput) userInput.focus();

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const u = userInput.value.trim();
      const p = passInput.value;
      const msg = document.getElementById('loginMsg');

      if (loginAdmin(u, p)) {
        msg.textContent = 'Autenticación correcta. Redirigiendo...';
        msg.style.color = '#4caf50';
        // redirige al dashboard que está en la misma carpeta administracion
        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 700);
      } else {
        msg.textContent = 'Credenciales inválidas.';
        msg.style.color = '#ff7676';
        // enfocar nuevamente el input de usuario
        userInput.focus();
      }
    });
  }
});
