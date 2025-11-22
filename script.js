document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecciona el contenedor de la lista de categorías
    const listaCategorias = document.getElementById('lista-categorias');
    const mensajeDiv = document.getElementById('mensaje-js');

    // 2. Agrega un "escuchador de eventos" (event listener) a toda la lista
    listaCategorias.addEventListener('click', (evento) => {
        // 3. Verifica si lo que se hizo clic es un enlace (<a>)
        if (evento.target.tagName === 'A' || evento.target.closest('A')) {
            // Obtenemos el texto del enlace (e.g., "Chops y Vasos Ferneteros")
            const textoCategoria = evento.target.textContent.trim();
            
            // 4. Actualiza el mensaje en el div
            mensajeDiv.textContent = `¡Cargando la sección: ${textoCategoria}! Un momento...`;
        }
    });

    // Mensaje inicial al cargar la página
    mensajeDiv.textContent = "¡Bienvenido a pela3D! Elige una categoría para empezar.";
});
