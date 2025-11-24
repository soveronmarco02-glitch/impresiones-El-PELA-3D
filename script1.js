// Variable global para almacenar el carrito de compra
// Usamos localStorage para persistir el carrito entre diferentes páginas (index.html, chops.html, etc.)
let carrito = JSON.parse(localStorage.getItem('carritoPela3D')) || [];
const numeroWhatsapp = "5491141915395"; // Número de WhatsApp destino

// Función para guardar el carrito en el almacenamiento local
function guardarCarrito() {
    localStorage.setItem('carritoPela3D', JSON.stringify(carrito));
}

// Función para actualizar el HTML del carrito
function actualizarCarritoHTML() {
    // Buscar los elementos en el DOM (puede que no existan en todas las páginas, por eso la verificación)
    const resumenDiv = document.getElementById('carrito-resumen');
    const botonFinalizar = document.getElementById('finalizar-compra');
    const mensajeJs = document.getElementById('mensaje-js');

    if (!resumenDiv) return; // Si la sección del carrito no está en la página, salir.

    let total = 0;
    let htmlContent = '';

    if (carrito.length === 0) {
        htmlContent = '<p>El carrito está vacío.</p>';
        if (botonFinalizar) botonFinalizar.disabled = true;
    } else {
        htmlContent += '<ul style="padding-left: 0; list-style: none;">';
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            // Usamos toLocaleString para mostrar el precio en formato AR$
            htmlContent += `
                <li style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dotted #ccc; padding-bottom: 5px;">
                    <div style="flex-grow: 1;">
                        <span>${item.cantidad} x ${item.nombre}</span>
                    </div>
                    <div style="flex-shrink: 0; display: flex; align-items: center;">
                        <span style="font-weight: bold;">AR$${subtotal.toLocaleString('es-AR')}</span> 
                        <button class="remove-item" data-nombre="${item.nombre}" style="margin-left: 15px; background: none; border: none; color: red; cursor: pointer; font-size: 1.2em;">&times;</button>
                    </div>
                </li>
            `;
        });
        htmlContent += '</ul>';
        htmlContent += `<p style="font-weight: bold; border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; font-size: 1.2em;">Total: AR$${total.toLocaleString('es-AR')}</p>`;
        if (botonFinalizar) botonFinalizar.disabled = false;
    }
    
    resumenDiv.innerHTML = htmlContent;
    
    // Asignar manejadores de eventos para remover ítems después de que el HTML es actualizado
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const nombre = event.target.getAttribute('data-nombre');
            removerDelCarrito(nombre);
        });
    });

    if (mensajeJs && carrito.length > 0) {
         // Mantener un mensaje de estado útil si hay productos
         mensajeJs.textContent = `🛒 ¡Tienes ${carrito.length} tipos de producto en tu carrito!`;
    }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
    const precioFloat = parseFloat(precio);
    if (isNaN(precioFloat)) {
        console.error("Error: El precio no es un número válido.");
        return;
    }
    
    // Buscar si el producto ya existe
    const itemExistente = carrito.find(item => item.nombre === nombre);

    if (itemExistente) {
        itemExistente.cantidad += 1; // Si existe, solo aumenta la cantidad
    } else {
        // Si no existe, lo agrega con cantidad 1
        carrito.push({ nombre, precio: precioFloat, cantidad: 1 });
    }

    guardarCarrito();
    actualizarCarritoHTML();
    
    const mensajeJs = document.getElementById('mensaje-js');
    if (mensajeJs) {
        mensajeJs.textContent = `✅ ¡${nombre} añadido al carrito! (Total: ${carrito.find(item => item.nombre === nombre).cantidad})`;
    }
}

// Función para remover o decrementar un producto del carrito
function removerDelCarrito(nombre) {
    const index = carrito.findIndex(item => item.nombre === nombre);
    const mensajeJs = document.getElementById('mensaje-js');

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
            if (mensajeJs) mensajeJs.textContent = `➖ ¡Una unidad de ${nombre} eliminada!`;
        } else {
            // Eliminar completamente si la cantidad es 1
            carrito.splice(index, 1);
            if (mensajeJs) mensajeJs.textContent = `🗑️ ¡${nombre} eliminado del carrito!`;
        }
    }
    
    guardarCarrito();
    actualizarCarritoHTML();
}

// Función que genera el mensaje y redirige a WhatsApp
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de finalizar.");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // 1. Crear el cuerpo del mensaje
    let mensaje = "¡Hola, pela3D! Quisiera realizar el siguiente pedido:\n\n";
    
    carrito.forEach(item => {
        mensaje += `- ${item.cantidad}x ${item.nombre} (Subtotal: AR$${(item.precio * item.cantidad).toLocaleString('es-AR')})\n`;
    });
    
    mensaje += `\n*TOTAL ESTIMADO: AR$${total.toLocaleString('es-AR')}*\n\n`;
    mensaje += "Por favor, confírmenme el stock y el método de pago. ¡Gracias!";

    // 2. Codificar el mensaje para el URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // 3. Crear el enlace final de WhatsApp
    const enlaceWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensajeCodificado}`;

    // 4. Redirigir y limpiar el carrito
    window.open(enlaceWhatsapp, '_blank');
    
    // Opcional: limpiar el carrito después de enviar el pedido
    carrito = [];
    guardarCarrito();
    actualizarCarritoHTML();

    const mensajeJs = document.getElementById('mensaje-js');
    if (mensajeJs) {
        mensajeJs.textContent = "¡Pedido enviado! Revisa WhatsApp. El carrito ha sido vaciado.";
    }
}

// Inicialización del script
document.addEventListener('DOMContentLoaded', () => {
    // 1. Asignar el evento a todos los botones "Agregar al Carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const nombre = event.target.getAttribute('data-nombre');
            const precio = event.target.getAttribute('data-precio');
            agregarAlCarrito(nombre, precio);
        });
    });

    // 2. Asignar el evento al botón "Finalizar Compra"
    const botonFinalizar = document.getElementById('finalizar-compra');
    if (botonFinalizar) {
        botonFinalizar.addEventListener('click', enviarPedidoWhatsApp);
    }

    // 3. Inicializar el carrito en el HTML al cargar la página
    actualizarCarritoHTML();
});
