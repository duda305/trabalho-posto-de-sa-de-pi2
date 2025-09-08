export function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(t => t.style.display = 'none');
    document.getElementById(tela).style.display = 'block';
}