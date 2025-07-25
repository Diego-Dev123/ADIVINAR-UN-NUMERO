// Variables utilizadas 
let numeroSecreto = 0;
let intentos = 1;
let listanumeros = [];
let numeroMaximo = 10;
let juegoTerminado = false;

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    mensajesIniciales();
    configurarEventListeners();
});

// Configurar event listeners
function configurarEventListeners() {
    const input = document.getElementById('valorUsuario');
    const botonIntentar = document.getElementById('botonIntentar');
    const botonReiniciar = document.getElementById('reiniciar');
    
    // Permitir jugar con Enter
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter' && !juegoTerminado) {
            verificarIntento();
        }
    });
    
    // Validar entrada en tiempo real
    input.addEventListener('input', validarEntrada);
    
    // Event listener para el botón reiniciar
    botonReiniciar.addEventListener('click', reiniciarJuego);
}

// Función mejorada para asignar texto con animaciones
function asignarTextoElemento(selector, texto, esExito = false) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.innerHTML = texto;
        
        // Añadir efecto visual para mensajes importantes
        if (esExito) {
            elemento.style.textShadow = '0 0 20px rgba(57, 255, 20, 0.8)';
            elemento.style.color = '#39ff14';
        } else if (selector === 'p' || selector === '#mensaje') {
            elemento.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
            elemento.style.color = '#b3b3b3';
        }
    }
}

// Función mejorada para verificar intento
function verificarIntento() {
    const numeroDeUsuario = parseInt(document.getElementById('valorUsuario').value);
    
    // Validaciones de entrada
    if (isNaN(numeroDeUsuario)) {
        mostrarMensajeError('Por favor, ingresa un número válido');
        return;
    }
    
    if (numeroDeUsuario < 1 || numeroDeUsuario > numeroMaximo) {
        mostrarMensajeError(`El número debe estar entre 1 y ${numeroMaximo}`);
        return;
    }
    
    if (juegoTerminado) {
        return;
    }

    // Lógica del juego
    if (numeroDeUsuario === numeroSecreto) {
        juegoTerminado = true;
        const mensajeVictoria = `¡Felicitaciones! Adivinaste el número secreto ${numeroSecreto} en ${intentos} ${intentos === 1 ? 'intento' : 'intentos'}`;
        asignarTextoElemento('#mensaje', mensajeVictoria, true);
        
        // Efectos de victoria
        mostrarEfectoVictoria();
        document.getElementById('reiniciar').removeAttribute('disabled');
        document.getElementById('botonIntentar').disabled = true;
        
    } else {
        // Proporcionar pistas más detalladas
        let mensaje = '';
        const diferencia = Math.abs(numeroDeUsuario - numeroSecreto);
        
        if (numeroDeUsuario < numeroSecreto) {
            mensaje = 'El número secreto es mayor';
        } else {
            mensaje = 'El número secreto es menor';
        }
        
        // Añadir pistas de proximidad
        if (diferencia === 1) {
            mensaje += ' - ¡Muy cerca!';
        } else if (diferencia <= 2) {
            mensaje += ' - ¡Cerca!';
        } else if (diferencia >= 5) {
            mensaje += ' - Bastante lejos';
        }
        
        asignarTextoElemento('#mensaje', mensaje);
    }
    
    intentos++;
    actualizarContadorIntentos();
    limpiarCaja();
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    const elemento = document.querySelector('#mensaje');
    if (elemento) {
        elemento.style.color = '#ff6b6b';
        elemento.style.textShadow = '0 0 15px rgba(255, 107, 107, 0.6)';
        elemento.innerHTML = mensaje;
        
        // Restaurar color después de 3 segundos
        setTimeout(() => {
            elemento.style.color = '#b3b3b3';
            elemento.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.1)';
        }, 3000);
    }
}

// Función mejorada para generar número secreto
function generarNumeroSecreto() {
    // Si ya se jugaron todos los números posibles
    if (listanumeros.length === numeroMaximo) {
        asignarTextoElemento('#mensaje', 'Ya se han jugado todos los números posibles. ¡Reinicia para jugar de nuevo!');
        document.getElementById('reiniciar').removeAttribute('disabled');
        return null;
    }
    
    let numeroGenerado;
    do {
        numeroGenerado = Math.floor(Math.random() * numeroMaximo) + 1;
    } while (listanumeros.includes(numeroGenerado));
    
    listanumeros.push(numeroGenerado);
    console.log(`Número secreto generado: ${numeroGenerado}`); // Para debugging
    return numeroGenerado;
}

// Función mejorada para limpiar caja
function limpiarCaja() {
    const input = document.getElementById('valorUsuario');
    if (input) {
        input.value = '';
        input.focus(); // Mantener el focus para mejor UX
    }
}

// Función para validar entrada en tiempo real
function validarEntrada() {
    const input = document.getElementById('valorUsuario');
    const valor = parseInt(input.value);
    
    if (input.value && (isNaN(valor) || valor < 1 || valor > numeroMaximo)) {
        input.style.borderColor = '#ff6b6b';
        input.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.4)';
    } else {
        input.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        input.style.boxShadow = 'none';
    }
}

// Función para actualizar contador de intentos
function actualizarContadorIntentos() {
    const contador = document.getElementById('contadorIntentos');
    if (contador) {
        contador.textContent = intentos - 1;
    }
}

// Función para mostrar efecto de victoria
function mostrarEfectoVictoria() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'borderGlow 0.5s ease-in-out 3';
    }
    
    // Añadir clase de victoria temporal
    document.body.classList.add('victoria');
    setTimeout(() => {
        document.body.classList.remove('victoria');
    }, 2000);
}

// Función mejorada para mensajes iniciales
function mensajesIniciales() {
    asignarTextoElemento('#titulo', '🎯 Juego del Número Secreto');
    asignarTextoElemento('#mensaje', `Estoy pensando en un número entre 1 y ${numeroMaximo}. ¿Puedes adivinarlo?`);
    
    numeroSecreto = generarNumeroSecreto();
    intentos = 1;
    juegoTerminado = false;
    
    actualizarContadorIntentos();
    
    // Habilitar controles
    const botonIntentar = document.getElementById('botonIntentar');
    const input = document.getElementById('valorUsuario');
    
    if (botonIntentar) botonIntentar.disabled = false;
    if (input) {
        input.disabled = false;
        input.focus();
    }
}

// Función mejorada para reiniciar juego
function reiniciarJuego() {
    limpiarCaja();
    mensajesIniciales();
    
    // Deshabilitar botón de reiniciar
    const botonReiniciar = document.getElementById('reiniciar');
    if (botonReiniciar) {
        botonReiniciar.setAttribute('disabled', 'true');
    }
    
    // Restaurar estilos del input
    const input = document.getElementById('valorUsuario');
    if (input) {
        input.style.borderColor = 'rgba(0, 255, 255, 0.3)';
        input.style.boxShadow = 'none';
    }
    
    console.log('Juego reiniciado');
}

// Función para mostrar estadísticas (opcional)
function mostrarEstadisticas() {
    const totalJuegos = listanumeros.length;
    const promedioIntentos = totalJuegos > 0 ? (intentos - 1) : 0;
    
    console.log(`Estadísticas del juego:
    - Juegos jugados: ${totalJuegos}
    - Números restantes: ${numeroMaximo - totalJuegos}
    - Intentos en juego actual: ${intentos - 1}`);
}

// Inicializar el juego
mensajesIniciales();