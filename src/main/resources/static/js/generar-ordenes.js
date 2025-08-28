const mapaMaquinaOperarios = {};

// Función para cambiar entre vista de tabla y cards
function toggleView() {
    const tableView = document.getElementById('viewTable').checked;
    const tableSection = document.getElementById('distributionTableSection');
    const cardsSection = document.getElementById('distributionCardsSection');
    
    if (tableView) {
        tableSection.classList.remove('hidden');
        cardsSection.classList.add('hidden');
    } else {
        tableSection.classList.add('hidden');
        cardsSection.classList.remove('hidden');
        updateDistributionCards();
    }
}

// Función para actualizar las cards de distribución
function updateDistributionCards() {
    const container = document.getElementById('distributionCardsContainer');
    const medios = parseInt(document.getElementById('medios').value) || 0;
    const litros = parseInt(document.getElementById('litros').value) || 0;
    const galones = parseInt(document.getElementById('galones').value) || 0;
    const cubetas = parseInt(document.getElementById('cubetas').value) || 0;
    
    container.innerHTML = '';
    
    if (medios > 0) {
        container.innerHTML += `
            <div class="esmalte-card">
                <h4>Medios (0.5 L)</h4>
                <p><strong>Cantidad:</strong> ${medios}</p>
                <p><strong>Total:</strong> ${(medios * 0.5).toFixed(2)} L</p>
            </div>
        `;
    }
    
    if (litros > 0) {
        container.innerHTML += `
            <div class="esmalte-card">
                <h4>Litros (1 L)</h4>
                <p><strong>Cantidad:</strong> ${litros}</p>
                <p><strong>Total:</strong> ${(litros * 1).toFixed(2)} L</p>
            </div>
        `;
    }
    
    if (galones > 0) {
        container.innerHTML += `
            <div class="esmalte-card">
                <h4>Galones (4 L)</h4>
                <p><strong>Cantidad:</strong> ${galones}</p>
                <p><strong>Total:</strong> ${(galones * 4).toFixed(2)} L</p>
            </div>
        `;
    }
    
    if (cubetas > 0) {
        container.innerHTML += `
            <div class="esmalte-card">
                <h4>Cubetas (19 L)</h4>
                <p><strong>Cantidad:</strong> ${cubetas}</p>
                <p><strong>Total:</strong> ${(cubetas * 19).toFixed(2)} L</p>
            </div>
        `;
    }
    
    // Agregar card de total si hay al menos un tipo de envase
    if (medios + litros + galones + cubetas > 0) {
        const total = medios * 0.5 + litros * 1 + galones * 4 + cubetas * 19;
        container.innerHTML += `
            <div class="esmalte-card" style="border-left-color: #10b981;">
                <h4>Total</h4>
                <p><strong>Litros totales:</strong> ${total.toFixed(2)} L</p>
            </div>
        `;
    } else {
        container.innerHTML = '<p>No hay distribución definida</p>';
    }
}

// --- Funciones auxiliares para notificaciones y carga ---
async function guardarEnBaseDeDatos() {
    try {
        mostrarLoading(true);
        const cargasVisuales = document.querySelectorAll('.carga-card');
        const cargasAEnviar = [];
        if (cargasVisuales.length === 0) {
            mostrarNotificacion('No hay cargas vinílicas para guardar.', 'error');
            return;
        }
        cargasVisuales.forEach(carga => {
            const folio = carga.dataset.folio;
            const codigoPintura = carga.dataset.codigo;
            const litrosAsignados = parseFloat(carga.dataset.litros) || 0;
            const maquinaAsignada = carga.dataset.maquina;
            const rondaAsignada = parseInt(carga.dataset.ronda) || 1;
            const cantMedios = parseInt(carga.dataset.medios) || 0;
            const cantLitros = parseInt(carga.dataset.litrosEnvase) || 0;
            const cantGalones = parseInt(carga.dataset.galones) || 0;
            const cantCubetas = parseInt(carga.dataset.cubetas) || 0;
            const descProducto = document.getElementById('descProducto')?.textContent || '';
            const categoriaProducto = document.getElementById('categoriaProducto')?.textContent || '';
            const prioridadProducto = document.getElementById('prioridadProducto')?.textContent || '';
            cargasAEnviar.push({
                folio: folio,
                codigoPintura: codigoPintura,
                totalLitros: litrosAsignados,
                fecha: new Date().toISOString(),
                tipoOrden: 'Producción',
                categoriaNombre: descProducto,
                categoriaPrioridad: parseInt(prioridadProducto) || 0,
                cubetas: cantCubetas,
                galones: cantGalones,
                litrosEnvase: cantLitros,
                medios: cantMedios,
                tipoPintura: 'vinilica',
                numeroBase: '',
                maquinaAsignada: maquinaAsignada,
                rondaAsignada: rondaAsignada,
            });
        });
        console.log('Enviando cargas vinílicas:', cargasAEnviar);
        const response = await fetch('http://localhost:8080/api/cargas/vinilicas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cargasAEnviar)
        });
        if (!response.ok) { throw new Error(`Error HTTP: ${response.status}`); }
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        if (result && Array.isArray(result)) {
            mostrarNotificacion(`¡Éxito! Se guardaron ${result.length} cargas vinílicas`, 'success');
            setTimeout(() => { location.reload(); }, 2000);
        } else { throw new Error('Formato de respuesta inesperado.'); }
    } catch (error) {
        console.error('Error al guardar en BD:', error);
        mostrarNotificacion('Error: ' + error.message, 'error');
    } finally {
        mostrarLoading(false);
    }
}

function mostrarLoading(mostrar) { 
    document.getElementById('loadingOverlay').style.display = mostrar ? 'flex' : 'none'; 
}

function mostrarNotificacion(mensaje, tipo) {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.style.display = 'block';
    setTimeout(() => { notification.style.display = 'none'; }, 5000);
}

// --- Lógica del formulario de carga y distribución de envases ---
function inicializarFormularioCarga() {
    const codigoInput = document.getElementById('codigo');
    const mediosInput = document.getElementById('medios');
    const litrosInput = document.getElementById('litros');
    const galonesInput = document.getElementById('galones');
    const cubetasInput = document.getElementById('cubetas');
    const cantMedios = document.getElementById('cantMedios');
    const cantLitros = document.getElementById('cantLitros');
    const cantGalones = document.getElementById('cantGalones');
    const cantCubetas = document.getElementById('cantCubetas');
    const litrosMedios = document.getElementById('litrosMedios');
    const litrosLitros = document.getElementById('litrosLitros');
    const litrosGalones = document.getElementById('litrosGalones');
    const litrosCubetas = document.getElementById('litrosCubetas');
    const totalDistribucionSpan = document.getElementById('totalDistribucion');
    const totalTabla = document.getElementById('litrosTotalTabla');

    async function actualizarEnvasesDisponibles(codigo) {
        try {
            const response = await fetch(`http://localhost:8080/api/productos/envases/${codigo}`);
            if (!response.ok) throw new Error('Error al obtener envases');
            const envases = await response.json();
            [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(i => {
                i.parentElement.style.display = 'block';
                i.value = 0;
            });
            console.log('Envases recibidos de la API:', envases);
            const disponibles = envases.map(e => parseFloat(e.envase?.capacidad ?? e.capacidad));
            if (!disponibles.includes(0.5)) mediosInput.parentElement.style.display = 'none';
            if (!disponibles.includes(1)) litrosInput.parentElement.style.display = 'none';
            if (!disponibles.includes(4)) galonesInput.parentElement.style.display = 'none';
            if (!disponibles.includes(19)) cubetasInput.parentElement.style.display = 'none';
            if (disponibles.length === 0) { mostrarNotificacion('No hay envases disponibles para este código', 'error'); }
        } catch (error) {
            console.error('Error al obtener envases:', error);
            [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(i => { i.parentElement.style.display = 'none'; });
            mostrarNotificacion('Error al cargar envases', 'error');
        }
    }

    function actualizarVistaDistribucion() {
        const m = parseInt(mediosInput.value) || 0;
        const l = parseInt(litrosInput.value) || 0;
        const g = parseInt(galonesInput.value) || 0;
        const c = parseInt(cubetasInput.value) || 0;
        cantMedios.textContent = m;
        cantLitros.textContent = l;
        cantGalones.textContent = g;
        cantCubetas.textContent = c;
        litrosMedios.textContent = (m * 0.5).toFixed(2);
        litrosLitros.textContent = (l * 1).toFixed(2);
        litrosGalones.textContent = (g * 4).toFixed(2);
        litrosCubetas.textContent = (c * 19).toFixed(2);
        const total = m*0.5 + l*1 + g*4 + c*19;
        totalDistribucionSpan.textContent = total.toFixed(2);
        totalTabla.textContent = total.toFixed(2);
        
        // Actualizar también las cards si están visibles
        if (!document.getElementById('viewTable').checked) {
            updateDistributionCards();
        }
    }

    [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(input => { 
        input.addEventListener('input', actualizarVistaDistribucion); 
    });
    
    codigoInput.addEventListener('blur', () => {
        const codigo = codigoInput.value.trim();
        if (codigo) {
            actualizarEnvasesDisponibles(codigo);
        } else {
            [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(i => { 
                i.parentElement.style.display = 'block'; 
                i.value = 0; 
            });
            actualizarVistaDistribucion();
        }
    });
    
    actualizarVistaDistribucion();
}

// Función para exportar órdenes (procesamiento de PDF)
async function inicializarExportacionOrdenes() {
    const exportarBtn = document.getElementById('exportarOrdenes');
    const inputPdf = document.getElementById('inputPdf');

    exportarBtn.addEventListener('click', () => inputPdf.click());

    inputPdf.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Tomar folios, rondas y máquina desde las cards visibles
        const cargasVisuales = document.querySelectorAll('.carga-card');

        console.log("Cards encontradas:", cargasVisuales);

        const cargas = Array.from(cargasVisuales).map(carga => {
            const maquina = carga.dataset.maquina || 'N/A';
            const operarios = mapaMaquinaOperarios[maquina] || [];
            console.log("Maquina:", maquina, "Operarios:", operarios);
            return {
                folio: carga.dataset.folio,
                ronda: parseInt(carga.dataset.ronda) || 1,
                maquina: maquina,
                operario: operarios.join(', ') || 'N/A'
            };
        });

        console.log("Cargas a enviar al backend:", cargas);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('cargas', JSON.stringify(cargas));

        try {
            const res = await fetch("http://localhost:5003/procesar_pdf", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Error al procesar PDF");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = "resultado.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Error:", err);
            alert("Error al enviar PDF: " + err.message);
        } finally {
            inputPdf.value = "";
        }
    });
}



// --- SCRIPT PRINCIPAL PARA LA FUNCIONALIDAD DE RECOMENDACIÓN DE EXCEL ---
function inicializarRecomendacionExcel() {
    const excelLoadingModal = document.getElementById('excelLoadingModal');
    const modalRecomendacion = document.getElementById('modalRecomendacion');
    const contenidoRecomendacion = document.getElementById('contenidoRecomendacion');
    const closeModalRecomendacion = document.getElementById('closeModalRecomendacion');
    const cerrarRecomendacion = document.getElementById('cerrarRecomendacion');
    const tablaRondas = document.getElementById('tablaRondas');

    let recomendacionesRaw = null; // guardará el objeto completo devuelto por el backend

    // click en el botón recomendar -> abrir file picker y enviar
    document.getElementById('btnRecomendar').addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx, .xls';
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            excelLoadingModal.style.display = 'flex';
            tablaRondas.innerHTML = '';

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('http://localhost:5001/recomendar', { method: 'POST', body: formData });
                if (!res.ok) {
                    let errorText = 'Error en el servidor';
                    try { const err = await res.json(); errorText = err.error || errorText; } catch {}
                    throw new Error(`${errorText} (HTTP ${res.status})`);
                }
                const data = await res.json();
                // Mostrar resultados con filtros en modal
                mostrarRecomendacionEnModal(data);
            } catch (error) {
                console.error('Error al subir o analizar el archivo:', error);
                contenidoRecomendacion.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Error al procesar el archivo: ${error.message}.</p>`;
                modalRecomendacion.style.display = 'flex';
            } finally {
                excelLoadingModal.style.display = 'none';
            }
        });
        fileInput.click();
    });

    // cierre modal
    function cerrarModalRecomendacion() { modalRecomendacion.style.display = 'none'; }
    if (closeModalRecomendacion) closeModalRecomendacion.addEventListener('click', cerrarModalRecomendacion);
    if (cerrarRecomendacion) cerrarRecomendacion.addEventListener('click', cerrarModalRecomendacion);
    window.addEventListener('click', (e) => { if (e.target === modalRecomendacion) cerrarModalRecomendacion(); });

    // Normaliza / extrae valor numérico de "Alcances en Dia" variando claves posibles
    function getAlcancesNumeric(item) {
        const candidates = ['Alcances en Dia','Alcances en Día','Alcances','alcances','alcance','Alcances_en_Dia'];
        for (const key of candidates) {
            if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
                const n = Number(String(item[key]).replace(',', '.'));
                if (!isNaN(n)) return n;
            }
        }
        return null;
    }

    // Devuelve array normalizado según la sección solicitada
    function getItemsForSection(sectionKey) {
        if (!recomendacionesRaw) return [];
        const arr = Array.isArray(recomendacionesRaw[sectionKey]) ? recomendacionesRaw[sectionKey] : [];
        return arr.map(it => {
            return {
                Producto: it.Producto ?? it.producto ?? it.nombre ?? it.Codigo ?? it.codigo ?? '',
                TipoDeRotacion: it['Tipo de Rotacion'] ?? it.tipoRotacion ?? it.tipo ?? '',
                AlcancesDia: getAlcancesNumeric(it)
            };
        });
    }

    // Construye y muestra la UI del modal (warnings + filtros + container)
    function mostrarRecomendacionEnModal(data) {
        recomendacionesRaw = data || {};
        // Si backend envía error
        if (data && data.error) {
            contenidoRecomendacion.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-circle"></i> Error: ${data.error}</p>`;
            modalRecomendacion.style.display = 'flex';
            return;
        }

        let htmlTop = '';
        // warnings si existen
        if (data && data.warnings && data.warnings.length > 0) {
            data.warnings.forEach(w => {
                htmlTop += `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> ${w}</p>`;
            });
        }

        htmlTop += `<h3>Análisis de Inventario Completado <i class="fas fa-chart-bar"></i></h3>`;

        // Filtros: selector de sección + búsqueda + orden
        htmlTop += `
            <div class="filtros-recomendacion">
                <select id="seccionRecomendacion" title="Sección">
                    <option value="productos_criticos_sin_carga">Críticos SIN Carga</option>
                    <option value="productos_criticos_con_carga">Críticos CON Carga</option>
                    <option value="sugerencias_criticas_alta_rotacion">Alta Rotación</option>
                    <option value="productos_excedente">Excedente</option>
                </select>

                <input id="buscarRecomendacion" placeholder="Buscar por producto o tipo" />

                <select id="ordenarRecomendacion" title="Ordenar">
                    <option value="ninguno">Ordenar por...</option>
                    <option value="alcanceAsc">Alcance (menor a mayor)</option>
                    <option value="alcanceDesc">Alcance (mayor a menor)</option>
                    <option value="nombreAsc">Nombre (A → Z)</option>
                    <option value="nombreDesc">Nombre (Z → A)</option>
                </select>
            </div>

            <div id="tablaRecomendacionContainer"></div>
        `;

        contenidoRecomendacion.innerHTML = htmlTop;
        // attach listeners
        const seccionEl = document.getElementById('seccionRecomendacion');
        const buscarEl = document.getElementById('buscarRecomendacion');
        const ordenarEl = document.getElementById('ordenarRecomendacion');

        if (seccionEl) seccionEl.addEventListener('change', aplicarFiltros);
        if (buscarEl) buscarEl.addEventListener('input', aplicarFiltros);
        if (ordenarEl) ordenarEl.addEventListener('change', aplicarFiltros);

        // render inicial
        aplicarFiltros();

        modalRecomendacion.style.display = 'flex';
    }

    // Aplica búsqueda y orden sobre la sección seleccionada
    function aplicarFiltros() {
        const seccion = document.getElementById('seccionRecomendacion')?.value || 'productos_criticos_sin_carga';
        const texto = (document.getElementById('buscarRecomendacion')?.value || '').toLowerCase();
        const orden = document.getElementById('ordenarRecomendacion')?.value || 'ninguno';

        let items = getItemsForSection(seccion);

        // filtro de búsqueda sobre Producto o TipoDeRotacion
        if (texto) {
            items = items.filter(it => {
                const p = (it.Producto || '').toString().toLowerCase();
                const t = (it.TipoDeRotacion || '').toString().toLowerCase();
                return p.includes(texto) || t.includes(texto);
            });
        }

        // ordenamiento
        if (orden === 'alcanceAsc') {
            items.sort((a,b) => {
                const A = a.AlcancesDia === null ? Infinity : a.AlcancesDia;
                const B = b.AlcancesDia === null ? Infinity : b.AlcancesDia;
                return A - B;
            });
        } else if (orden === 'alcanceDesc') {
            items.sort((a,b) => {
                const A = a.AlcancesDia === null ? -Infinity : a.AlcancesDia;
                const B = b.AlcancesDia === null ? -Infinity : b.AlcancesDia;
                return B - A;
            });
        } else if (orden === 'nombreAsc') {
            items.sort((a,b) => (a.Producto||'').localeCompare(b.Producto||''));
        } else if (orden === 'nombreDesc') {
            items.sort((a,b) => (b.Producto||'').localeCompare(a.Producto||''));
        }

        renderizarRecomendaciones(items);
    }

    // Renderiza la tabla con los items ya filtrados/ordenados
    function renderizarRecomendaciones(items) {
        const container = document.getElementById('tablaRecomendacionContainer');
        if (!items || items.length === 0) {
            container.innerHTML = `<p class="loading-message">No hay coincidencias en esta sección.</p>`;
            return;
        }

        let html = `
            <table class="recommendation-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Tipo de Rotación</th>
                        <th>Alcances en Día</th>
                    </tr>
                </thead>
                <tbody>
        `;
            items.forEach(it => {
                html += `<tr>
                    <td>${escapeHtml(it.Producto)}</td>
                    <td>${escapeHtml(it.TipoDeRotacion)}</td>
                    <td>${it.AlcancesDia !== null && it.AlcancesDia !== undefined ? Number(it.AlcancesDia).toFixed(2) : 'N/A'}</td>
                </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        }

        // pequeña función para prevenir inyección (básica)
        function escapeHtml(text) {
            if (!text && text !== 0) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el selector de vista
    document.querySelectorAll('input[name="viewOption"]').forEach(radio => {
        radio.addEventListener('change', toggleView);
    });
    
    const guardarEnBDBtn = document.getElementById('guardarEnBD');
    if (guardarEnBDBtn) { guardarEnBDBtn.addEventListener('click', guardarEnBaseDeDatos); }
    
    const fechaInput = document.getElementById('fechaCargas');
    if (fechaInput) {
        fechaInput.addEventListener('change', (event) => {
            const fechaSeleccionada = event.target.value;
            if (fechaSeleccionada) { window.location.href = `historial.html?fecha=${fechaSeleccionada}`; }
        });
    }
    
    // Inicializar funcionalidades
    inicializarFormularioCarga();
    inicializarExportacionOrdenes();
    inicializarRecomendacionExcel();
});