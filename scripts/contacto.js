document.getElementById("contactoForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const comentario = document.getElementById("comentario").value.trim();

  // Validar nombre
  if (nombre === "" || nombre.length > 100) {
    alert("⚠️ El nombre es requerido y debe tener máximo 100 caracteres.");
    return;
  }

  // Validar correo
  const regexCorreo = /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
  if (!regexCorreo.test(correo)) {
    alert("⚠️ Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com");
    return;
  }

  // Validar comentario
  if (comentario === "" || comentario.length > 500) {
    alert("⚠️ El comentario es requerido y debe tener máximo 500 caracteres.");
    return;
  }

  alert("✅ Mensaje enviado con éxito. Gracias por contactarnos!");
  document.getElementById("contactoForm").reset();
});
