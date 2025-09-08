// scripts/contacto.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactoForm");
  const mensaje = document.getElementById("mensaje-exito");

  if (!form || !mensaje) return; // seguridad

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    // Validar nombre
    if (nombre === "" || nombre.length > 100) {
      showInlineError("nombre", "El nombre es requerido y debe tener máximo 100 caracteres.");
      return;
    }

    // Validar correo
    const regexCorreo = /^[\w.%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    if (!regexCorreo.test(correo)) {
      showInlineError("correo", "Solo se permiten correos @duoc.cl, @profesor.duoc.cl y @gmail.com");
      return;
    }

    // Validar comentario
    if (comentario === "" || comentario.length > 500) {
      showInlineError("comentario", "El comentario es requerido y debe tener máximo 500 caracteres.");
      return;
    }

    // Si todo OK: mostrar mensaje de éxito estilizado
    mensaje.innerHTML = "<strong>¡Mensaje enviado!</strong> Gracias por contactarnos.";
    mensaje.style.display = "block";
    // añadir clase .show para animación si CSS la usa
    mensaje.classList.add("show");
    mensaje.setAttribute("role", "status");
    mensaje.setAttribute("aria-live", "polite");

    // limpiar errores previos si hubieran
    clearInlineError("nombre");
    clearInlineError("correo");
    clearInlineError("comentario");

    // reset del formulario
    form.reset();

    // ocultar mensaje después de 4s con una pequeña transición
    setTimeout(() => {
      mensaje.classList.remove("show");
      // espera a la transición antes de ocultar por completo
      setTimeout(() => (mensaje.style.display = "none"), 300);
    }, 8000);
  });

  // Funciones auxiliares para mensajes de campo
  function showInlineError(fieldId, message) {
    // elimina mensajes anteriores
    clearInlineError(fieldId);

    const field = document.getElementById(fieldId);
    if (!field) {
      alert(message); // fallback
      return;
    }

    const small = document.createElement("small");
    small.className = "error-field";
    small.textContent = message;
    // estilo inline debajo del input
    field.parentNode.appendChild(small);

    // opcional: enfocar el campo con error
    field.focus();
  }

  function clearInlineError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const existing = field.parentNode.querySelector(".error-field");
    if (existing) existing.remove();
  }
});
