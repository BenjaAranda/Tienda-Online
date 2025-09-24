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
