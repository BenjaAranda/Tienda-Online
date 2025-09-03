const logo = document.querySelector('.logo');
const iconos = document.querySelector('.iconos');

if (posicionActual > ultimaPosicion) {
    logo.style.display = 'none';
    iconos.style.display = 'none';
} else {
    logo.style.display = 'flex';
    iconos.style.display = 'flex';
}
