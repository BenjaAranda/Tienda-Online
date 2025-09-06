// Simulación de usuarios guardados en localStorage
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// --- Registro ---
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const edad = parseInt(document.getElementById("edad").value);
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  // Validación de edad
  if (edad < 18) {
    alert("Debes tener al menos 18 años para registrarte.");
    return;
  }

  // Validación de correo DUOC
  let descuento = false;
  if (email.endsWith("@duocuc.cl")) {
    descuento = true;
    alert("¡Felicidades! Obtienes un 20% de descuento de por vida por usar correo DUOC.");
  }

  // Crear usuario
  const nuevoUsuario = { nombre, edad, email, password, descuento };
  usuarios.push(nuevoUsuario);

  // Guardar en localStorage
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso. Ahora puedes iniciar sesión.");

  document.getElementById("registerForm").reset();
});

// --- Iniciar Sesión ---
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    alert(`Bienvenido ${usuario.nombre}`);
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    window.location.href = "index.html"; // redirige al home de la tienda
  } else {
    alert("Correo o contraseña incorrectos.");
  }
});

// --- Login Admin (simulado) ---
document.getElementById("adminLoginBtn").addEventListener("click", () => {
  alert("Aquí irá el login de administrador (pendiente de implementar).");
});
document.getElementById("contactoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Mostrar mensaje de éxito
  const mensaje = document.getElementById("mensaje-exito");
  mensaje.textContent = "✅ ¡Mensaje enviado! Gracias por contactarnos.";
  mensaje.style.display = "block";

  // Limpiar formulario
  this.reset();

  // Ocultar mensaje automáticamente después de 4 segundos
  setTimeout(() => {
    mensaje.style.display = "none";
  }, 4000);
});

