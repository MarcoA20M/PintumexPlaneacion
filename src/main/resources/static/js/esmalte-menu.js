// js/esmalte-menu.js
class EsmalteMenuManager {
    constructor() {
        this.modeVinilica = document.getElementById('modeVinilica');
        this.modeEsmalte = document.getElementById('modeEsmalte');
        this.vinilicaSection = document.getElementById('vinilicaMode');
        this.esmalteSection = document.getElementById('esmalteMode');
        
        this.init();
    }
    
    init() {
        // Event listeners para los botones
        if (this.modeEsmalte) {
            this.modeEsmalte.addEventListener('click', () => this.cambiarModo('esmalte'));
        }
        
        if (this.modeVinilica) {
            this.modeVinilica.addEventListener('click', () => this.cambiarModo('vinilica'));
        }
        
        // Inicializar en modo vinílica
        this.cambiarModo('vinilica');
    }
    
    cambiarModo(modo) {
        if (modo === 'esmalte') {
            // Activar modo esmalte
            this.modeEsmalte.classList.add('active');
            this.modeVinilica.classList.remove('active');
            this.vinilicaSection.style.display = 'none';
            this.esmalteSection.style.display = 'block';
            
            // Cargar datos de esmalte si es necesario
            this.cargarDatosEsmalte();
        } else {
            // Activar modo vinílica (por defecto)
            this.modeVinilica.classList.add('active');
            this.modeEsmalte.classList.remove('active');
            this.vinilicaSection.style.display = 'block';
            this.esmalteSection.style.display = 'none';
        }
    }
    
    cargarDatosEsmalte() {
        // Aquí puedes cargar datos específicos para esmaltes si es necesario
        console.log("Cargando datos de esmalte...");
        // Por ejemplo: cargar tabla de esmaltes, personal, etc.
    }
    
    // Métodos adicionales para gestionar esmaltes
    agregarCargaEsmalte(datos) {
        // Lógica para agregar carga de esmalte
    }
    
    eliminarCargaEsmalte(id) {
        // Lógica para eliminar carga de esmalte
    }
    
    // Más métodos según sea necesario...
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.esmalteMenu = new EsmalteMenuManager();
});