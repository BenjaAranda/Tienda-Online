document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-buscador");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const categoria = document.getElementById("categoria").value;
      const texto = document.getElementById("busqueda").value.trim();

      // Redirigir a productos.html con parámetros de búsqueda
      const url = `productos.html?categoria=${encodeURIComponent(categoria)}&q=${encodeURIComponent(texto)}`;
      window.location.href = url;
    });
  }
});
