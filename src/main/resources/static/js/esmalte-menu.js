// js/esmalte-menu.js
class EsmalteMenuManager {
    constructor() {
        this.modeVinilica = document.getElementById('modeVinilica');
        this.modeEsmalte = document.getElementById('modeEsmalte');
        this.vinilicaSection = document.getElementById('vinilicaMode');
        this.esmalteSection = document.getElementById('esmalteMode');
        this.esmalteCargasTable = document.getElementById('esmalte-cargas-table');
        this.resumenContainer = document.getElementById('resumen-container');

        this.init();
    }
    
    init() {
        if (this.modeEsmalte) {
            this.modeEsmalte.addEventListener('click', () => this.cambiarModo('esmalte'));
        }
        
        if (this.modeVinilica) {
            this.modeVinilica.addEventListener('click', () => this.cambiarModo('vinilica'));
        }
        
        this.cambiarModo('vinilica');
    }
    
    async cambiarModo(modo) {
        if (modo === 'esmalte') {
            this.modeEsmalte.classList.add('active');
            this.modeVinilica.classList.remove('active');
            this.vinilicaSection.style.display = 'none';
            this.esmalteSection.style.display = 'block';
            
            await this.cargarDatosEsmalte();
        } else {
            this.modeVinilica.classList.add('active');
            this.modeEsmalte.classList.remove('active');
            this.vinilicaSection.style.display = 'block';
            this.esmalteSection.style.display = 'none';
        }
    }

    async cargarDatosEsmalte() {
        this.esmalteCargasTable.innerHTML = '<p>Cargando cargas de esmalte...</p>';
        this.resumenContainer.innerHTML = '<p>Calculando resumen...</p>';
        
        try {
            const response = await fetch('http://localhost:3000/api/esmaltes');
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de las cargas de esmalte.');
            }
            const cargasEsmalte = await response.json();
            
            this.renderizarCargasEsmalte(cargasEsmalte);
            this.renderizarResumenPersonal(cargasEsmalte);

        } catch (error) {
            console.error('Error al cargar datos de esmalte:', error);
            this.esmalteCargasTable.innerHTML = '<p class="error-message">Error al cargar las cargas.</p>';
            this.resumenContainer.innerHTML = '<p class="error-message">Error al cargar el resumen.</p>';
        }
    }
    
    renderizarCargasEsmalte(cargas) {
        let html = `
            <h4>Cargas de Esmalte</h4>
            <div class="cargas-esmalte-grid">
                <div>Folio</div>
                <div>Código</div>
                <div>Tipo</div>
                <div>Litros</div>
                <div>Personal Asignado</div>
            </div>
        `;
        
        cargas.forEach(carga => {
            const personalAsignado = [carga.molida_preparado, carga.terminado].filter(Boolean).join(', ');
            html += `
                <div class="cargas-esmalte-row">
                    <span>${carga.folio}</span>
                    <span>${carga.codigo}</span>
                    <span>${carga.tipo}</span>
                    <span>${carga.litros}</span>
                    <span>${personalAsignado || 'N/A'}</span>
                </div>
            `;
        });

        this.esmalteCargasTable.innerHTML = html;
    }

    renderizarResumenPersonal(cargas) {
        const resumen = {
            'Molienda y Preparado': {},
            'Terminado': {}
        };

        cargas.forEach(carga => {
            const molidaPreparado = carga.molida_preparado;
            const terminado = carga.terminado;

            if (molidaPreparado) {
                resumen['Molienda y Preparado'][molidaPreparado] = (resumen['Molienda y Preparado'][molidaPreparado] || 0) + 1;
            }
            if (terminado) {
                resumen['Terminado'][terminado] = (resumen['Terminado'][terminado] || 0) + 1;
            }
        });

        let html = '';
        for (const rol in resumen) {
            const personal = resumen[rol];
            const personalCount = Object.keys(personal).length;

            if (personalCount > 0) {
                html += `
                    <div class="resumen-rol">
                        <h5>${rol}</h5>
                        <ul>
                `;
                for (const persona in personal) {
                    html += `<li>${persona}: ${personal[persona]} cargas</li>`;
                }
                html += `
                        </ul>
                    </div>
                `;
            }
        }
        
        this.resumenContainer.innerHTML = html || '<p>No se ha asignado personal aún.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.esmalteMenu = new EsmalteMenuManager();
});

