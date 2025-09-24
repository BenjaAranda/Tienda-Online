// Alternar entre módulos del dashboard
const navItems = document.querySelectorAll(".sidebar nav ul li");
const modules = document.querySelectorAll(".module");

navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
    // Quitar activo de todos
    navItems.forEach(el => el.classList.remove("active"));
    modules.forEach(el => el.classList.add("hidden"));

    // Activar seleccionado
    
    item.classList.add("active");

    //llevar a paguina seleccionada
    

    
    });


const items = document.querySelectorAll('.nav-block ul li');

items.forEach(li => {
    li.addEventListener('click', () => {
        const url = li.getAttribute('data-url');
        if(url) {
        window.location.href = url;
    }
    });
});
});

const puntosActuales = 100; // Ejemplo de puntos actuales

const puntosPorNivel = {
    "bronce": 0,
    "plata": 50,
    "oro": 100,
    "platino": 200,
    "diamante": 350,
    "esmeralda": 500
};

// Función para calcular nivel
function calcularNivel(puntos) {
    let nivel = "bronce";
    for (let n in puntosPorNivel) {
    if (puntos >= puntosPorNivel[n]) {
        nivel = n;
    } else {
        break;
    }
    }
    return nivel;
}

// Función para calcular progreso hacia el siguiente nivel
function calcularProgreso(puntos) {
    let niveles = Object.keys(puntosPorNivel);
    for (let i = 0; i < niveles.length; i++) {
    let nivel = niveles[i];
    let siguiente = niveles[i + 1];

    if (!siguiente) return 4500; // nivel máximo alcanzado

    if (puntos >= puntosPorNivel[nivel] && puntos < puntosPorNivel[siguiente]) {
        let rango = puntosPorNivel[siguiente] - puntosPorNivel[nivel];
        let avance = puntos - puntosPorNivel[nivel];
      return (avance / rango) * 100;
    }
    }
}

// Mostrar nivel actual
document.getElementById("nivel-actual").innerText = calcularNivel(puntosActuales);

// Mostrar progreso
document.getElementById("barra-progreso").style.width = calcularProgreso(puntosActuales) + "%";

//mostras hisotrial de puntos
const historial = [
    { fecha: "20-09-2025", descripcion: 'Compra - PC ', puntos: +70, caducidad: "20-09-2026" },
    { fecha: "15-09-2025", descripcion: "Canje - Cupón envío gratis", puntos: -100, caducidad: "-" },
    { fecha: "10-09-2025", descripcion: "Compra - Monitor", puntos: +200, caducidad: "10-09-2026" },
    { fecha: "05-09-2025", descripcion: "Devolución - Auriculares", puntos: -50, caducidad: "-" },
    { fecha: "01-09-2025", descripcion: "Compra - Teclado mecánico", puntos: +80, caducidad: "01-09-2026" }
];
const tbody = document.querySelector("table tbody");
historial.forEach(entry => {
    const tr = document.createElement("tr"); 
    tr.innerHTML = `
        <td>${entry.fecha}</td>
        <td>${entry.descripcion}</td>
        <td class="${entry.puntos > 0 ? 'positivo' : 'negativo'}">${entry.puntos > 0 ? '+' : ''}${entry.puntos}</td>
        <td>${entry.caducidad}</td>
    `;
    tbody.appendChild(tr);
});

let index = 0;
const beneficios = document.querySelectorAll(".beneficio");

function mostrarBeneficio() {
    beneficios.forEach((b, i) => {
    b.classList.remove("activo");
    if (i === index) b.classList.add("activo");
    });

  index = (index + 1) % beneficios.length; // pasa al siguiente (loop)
}

setInterval(mostrarBeneficio, 5000); // cambia cada 5 segundos
mostrarBeneficio(); // mostrar el primero al inicio
