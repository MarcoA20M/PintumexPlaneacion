// ====== Configuración inicial ======
const categoriasPrioridad = {
    // Categorías de Vinílicas
    "Transparentes": 1,
    "Basicos": 2,
    "Basicos 1": 3,
    "Basicos 2": 4,
    "Unica": 5,
    "Base Nueva": 6,
    "Intensos 1": 7,
    "Intensos": 8,
    "Intensos 2": 9,
    "Medios": 10,
    "Pastel": 11,
    "Tonos": 12,
    "Pastel 1": 13,
    "Pastel 2": 14,
    "Blancos": 15,
    "Directos": 16,

    // Categorías de Esmaltes
    "Esmalux SR": 1,
    "DryLux SR": 2,
    "Automotive": 3,
    "Base Transparente": 4,
    "Base Blanca": 5,
    "Base Pastel": 6,
    "Base Media": 7,
    "Base Intensa": 8,
    "Igualacion": 9
};

const capacidadesMaquinas = {
    "VI-101": 850,
    "VI-102": 850,
    "VI-103": 850,
    "VI-104": 2400,
    "VI-105": 850,
    "VI-106": 850,
    "VI-107": 1600,
    "VI-108": 2400
};

const maquinas = Object.keys(capacidadesMaquinas);
const rondasTotales = 4;
const mapaMaquinaRondas = {};
let cargasGuardadas = [];

const equipoTerminado = ["Alberto", "Pedro", "Gaspar"];
const equipoMoliendaPreparado = ["Germán", "Aldo"];
let indiceTerminado = 0;
let indiceMoliendaPreparado = 0;


// Inicializar estructura de datos para cada máquina y ronda
maquinas.forEach(m => {
    mapaMaquinaRondas[m] = {};
    for (let r = 1; r <= rondasTotales; r++) {
        mapaMaquinaRondas[m][r] = [];
    }
});

// ====== Variables DOM ======
const folioInput = document.getElementById('folio');
const codigoInput = document.getElementById('codigo');
const descSpan = document.getElementById('descProducto');
const baseSpan = document.getElementById('baseProducto');
const categoriaSpan = document.getElementById('categoriaProducto');
const prioridadSpan = document.getElementById('prioridadProducto');
const infoDiv = document.getElementById('infoProducto');
const mensaje = document.getElementById('mensaje');
const mediosInput = document.getElementById('medios');
const litrosInput = document.getElementById('litros');
const galonesInput = document.getElementById('galones');
const cubetasInput = document.getElementById('cubetas');
const tabla = document.getElementById("tablaRondas");

// Controles de Modo
const modeVinilica = document.getElementById('modeVinilica');
const modeEsmalte = document.getElementById('modeEsmalte');
const vinilicaSection = document.getElementById('vinilicaMode');
const esmalteSection = document.getElementById('esmalteMode');
const formCarga = document.getElementById('formCarga');

// Modal Elements
const verCargasButton = document.getElementById('verCargas');
const modalCargas = document.getElementById('modalCargas');
const closeModalButton = document.getElementById('closeModal');
const cargasTableBody = document.querySelector('#cargasTable tbody');
const asignarRondasBtn = document.getElementById('btnAsignarRondas');
const btnAsignarEsmaltes = document.getElementById('btnAsignarEsmaltes');

// Loading Overlay
const loadingOverlay = document.getElementById('loadingOverlay');


// ====== Funciones auxiliares y lógica del negocio ======

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
}

function generarFolioBase() {
    const hoy = new Date();
    const anio = String(hoy.getFullYear()).slice(-2);
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    const modo = modeEsmalte.classList.contains('active') ? 'E' : 'V';
    return `${modo}${anio}${mes}${dia}`;
}

function generarFolioTemporal() {
    const hoy = new Date();
    const anio = String(hoy.getFullYear()).slice(-2);
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    const marcaTiempo = Date.now();
    const modo = modeEsmalte.classList.contains('active') ? 'E' : 'V';
    return `${modo}${anio}${mes}${dia}-${marcaTiempo}`;
}

function inicializarFolio() {
    const numCargas = cargasGuardadas.filter(c => c.tipoPintura === (modeEsmalte.classList.contains('active') ? 'esmalte' : 'vinilica')).length + 1;
    const numero = String(numCargas).padStart(3, "0");
    const fechaString = generarFolioBase();
    folioInput.value = `${fechaString}${numero}`;
}

function actualizarDistribucion() {
    const medios = Number(mediosInput.value) || 0;
    const litros = Number(litrosInput.value) || 0;
    const galones = Number(galonesInput.value) || 0;
    const cubetas = Number(cubetasInput.value) || 0;

    const totalLitros = (medios * 0.5) + litros + (galones * 4) + (cubetas * 19);

    document.getElementById('cantMedios').textContent = medios;
    document.getElementById('cantLitros').textContent = litros;
    document.getElementById('cantGalones').textContent = galones;
    document.getElementById('cantCubetas').textContent = cubetas;

    document.getElementById('litrosMedios').textContent = (medios * 0.5).toFixed(2);
    document.getElementById('litrosLitros').textContent = litros.toFixed(2);
    document.getElementById('litrosGalones').textContent = (galones * 4).toFixed(2);
    document.getElementById('litrosCubetas').textContent = (cubetas * 19).toFixed(2);

    document.getElementById('totalDistribucion').textContent = totalLitros.toFixed(2);
    document.getElementById('litrosTotalTabla').textContent = totalLitros.toFixed(2);

    return totalLitros;
}


async function buscarProductoPorCodigo(codigo) {
    const modoActivo = modeEsmalte.classList.contains('active') ? 'esmalte' : 'vinilica';
    let endpoint = '';

    if (modoActivo === 'esmalte') {
        endpoint = `/api/esmaltes/codigo/${encodeURIComponent(codigo)}`;
    } else {
        endpoint = `/api/productos/codigo/${encodeURIComponent(codigo)}`;
    }

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Error en la búsqueda: ${response.statusText}`);
        }
        
        const producto = await response.json();
        
        if (modoActivo === 'esmalte') {
            return {
                descripcion: producto.descripcion,
                tipo: producto.tipo,
                es_igualacion: producto.es_igualacion,
                categoria: { 
                    nombre: producto.tipo,
                    prioridad: categoriasPrioridad[producto.tipo] || 99
                }
            };
        } else { // modo vinilica
            return {
                descripcion: producto.descripcion,
                base: producto.base,
                numeroBase: producto.numeroBase,
                categoria: { 
                    nombre: producto.categoria.nombre,
                    prioridad: categoriasPrioridad[producto.categoria.nombre] || 99 
                }
            };
        }
    } catch (error) {
        console.error("Error al buscar producto:", error);
        return null;
    }
}

async function cargarProductoPorCodigo() {
    const codigo = codigoInput.value.trim();
    if (!codigo) {
        infoDiv.style.display = 'none';
        return null;
    }

    const producto = await buscarProductoPorCodigo(codigo);

    if (producto) {
        descSpan.textContent = producto.descripcion;
        
        if (producto.base) {
            baseSpan.textContent = producto.base;
        } else if (producto.tipo) {
            baseSpan.textContent = producto.tipo;
        } else {
            baseSpan.textContent = 'N/A';
        }
        
        categoriaSpan.textContent = producto.categoria.nombre;
        prioridadSpan.textContent = producto.categoria.prioridad;
        infoDiv.style.display = 'block';
        mensaje.textContent = '';
        return producto;
    } else {
        descSpan.textContent = '';
        baseSpan.textContent = '';
        categoriaSpan.textContent = '';
        prioridadSpan.textContent = '';
        infoDiv.style.display = 'none';
        mensaje.style.color = 'red';
        mensaje.textContent = 'Código no encontrado.';
        return null;
    }
}


// ====== Funciones de Renderizado y Almacenamiento ======

async function renderizarTabla() {
    tabla.innerHTML = '';
    const encabezados = ['Máquina', 'Ronda 1', 'Ronda 2', 'Ronda 3', 'Ronda 4'];

    encabezados.forEach(encabezado => {
        const div = document.createElement('div');
        div.className = 'encabezado';
        div.textContent = encabezado;
        tabla.appendChild(div);
    });

    for (const maquina of maquinas) {
        const maquinaDiv = document.createElement('div');
        maquinaDiv.className = 'maquina';

        const hoy = new Date();
        const [año, semana] = getWeekNumber(hoy);

        try {
            const response = await fetch(`/api/rotacion/personal?maquina=${maquina}&semana=${semana}&año=${año}`);
            if (response.ok) {
                const operarios = await response.json();
                maquinaDiv.innerHTML = `
                    ${maquina}
                    <div class="nombre-operarios">${operarios.join(', ')}</div>
                `;
            } else {
                maquinaDiv.textContent = maquina;
            }
        } catch (error) {
            console.error('Error getting operators:', error);
            maquinaDiv.textContent = maquina;
        }

        tabla.appendChild(maquinaDiv);

        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            const rondaDiv = document.createElement('div');
            rondaDiv.className = 'dropzone';
            rondaDiv.dataset.maquina = maquina;
            rondaDiv.dataset.ronda = ronda;

            const cargas = mapaMaquinaRondas[maquina][ronda].filter(c => c.tipoOrden === 'madre');

            cargas.forEach(c => {
                const card = document.createElement('div');
                card.className = 'carga-card';
                card.dataset.folio = c.folio;
                card.dataset.codigo = c.codigoPintura;
                card.dataset.categoria = c.categoria ? c.categoria.nombre : '';
                card.dataset.prioridad = c.prioridad || 100;
                card.dataset.litros = c.litrosAsignados || 0;
                card.dataset.maquina = maquina;
                card.dataset.ronda = ronda;
                card.setAttribute('draggable', 'true');

                let distributionDetailsHtml = '';
                let detailsArray = [];

                if (c.cubetas > 0) {
                    detailsArray.push(`19 - ${c.cubetas}`);
                }
                if (c.galones > 0) {
                    detailsArray.push(`4 - ${c.galones}`);
                }
                if (c.litros_envase > 0) {
                    detailsArray.push(`1 - ${c.litros_envase}`);
                }
                if (c.medios > 0) {
                    detailsArray.push(`0.5 - ${c.medios}`);
                }

                distributionDetailsHtml = detailsArray.join(', ');

                card.innerHTML = `
                    <div class="header-content">
                        <div class="main-code">Código: ${c.codigoPintura}</div>
                        <div class="litros-total-circulo">${Math.round(c.litrosAsignados || 0)} L</div>
                    </div>
                    <div class="distribution-details-new">
                        ${distributionDetailsHtml}
                    </div>
                    <div class="card-footer">
                        <small>Base: ${c.numero_base}</small>
                    </div>
                `;
                rondaDiv.appendChild(card);
            });
            tabla.appendChild(rondaDiv);
        }
    }
    if (typeof habilitarDragAndDrop === 'function') {
        habilitarDragAndDrop();
    } else {
        console.warn("The function 'habilitarDragAndDrop' is not defined. If you need drag and drop functionality, please define it.");
    }
}

function renderizarTablaEsmaltes(cargas) {
    const contenedor = document.getElementById('esmalte-table-container');
    contenedor.innerHTML = '';
    
    if (cargas.length === 0) {
        contenedor.innerHTML = '<p class="info-message">No hay cargas de esmalte para mostrar.</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.classList.add('esmalte-table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Folio</th>
                <th>Código</th>
                <th>Tipo</th>
                <th>Litros</th>
                <th>Molienda/Preparado</th>
                <th>Terminado</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    const tbody = table.querySelector('tbody');
    cargas.forEach(carga => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${carga.folio}</td>
            <td>${carga.codigoPintura}</td>
            <td>${carga.tipo}</td>
            <td>${carga.totalLitros.toFixed(2)}</td>
            <td>${carga.asignadoMolienda || 'N/A'}</td>
            <td>${carga.asignadoTerminado || 'N/A'}</td>
        `;
        tbody.appendChild(row);
    });

    contenedor.appendChild(table);

    const personalSection = document.getElementById('personal-section');
    personalSection.innerHTML = '';
    
    if (cargas.length > 0) {
        const moliendaPersonal = cargas.filter(c => c.asignadoMolienda).reduce((acc, c) => {
            acc[c.asignadoMolienda] = (acc[c.asignadoMolienda] || 0) + 1;
            return acc;
        }, {});
        
        const terminadoPersonal = cargas.filter(c => c.asignadoTerminado).reduce((acc, c) => {
            acc[c.asignadoTerminado] = (acc[c.asignadoTerminado] || 0) + 1;
            return acc;
        }, {});
        
        let htmlPersonal = '<h3>Resumen de Asignación</h3>';
        htmlPersonal += `
            <div class="resumen-item">
                <h4>Molienda y Preparado</h4>
                <ul>
                    ${Object.entries(moliendaPersonal).map(([persona, count]) => `<li>${persona}: ${count} cargas</li>`).join('')}
                </ul>
            </div>
            <div class="resumen-item">
                <h4>Terminado</h4>
                <ul>
                    ${Object.entries(terminadoPersonal).map(([persona, count]) => `<li>${persona}: ${count} cargas</li>`).join('')}
                </ul>
            </div>
        `;
        personalSection.innerHTML = htmlPersonal;
    } else {
        personalSection.innerHTML = '<p class="info-message">No hay personal asignado.</p>';
    }
}


function guardarEstado() {
    localStorage.setItem('mapaMaquinaRondas', JSON.stringify(mapaMaquinaRondas));
    localStorage.setItem('cargasGuardadas', JSON.stringify(cargasGuardadas));
}

function cargarEstado() {
    const estadoMapa = localStorage.getItem('mapaMaquinaRondas');
    const estadoCargas = localStorage.getItem('cargasGuardadas');

    if (estadoMapa) {
        Object.assign(mapaMaquinaRondas, JSON.parse(estadoMapa));
    }
    if (estadoCargas) {
        cargasGuardadas = JSON.parse(estadoCargas);
    }
}


// ====== Funciones de Modo y Event Listeners ======

function cambiarModo(modo) {
    if (modo === 'esmalte') {
        modeEsmalte.classList.add('active');
        modeVinilica.classList.remove('active');
        vinilicaSection.style.display = 'none';
        esmalteSection.style.display = 'block';
        
        // Renderizar cargas de esmalte existentes
        const cargasEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
        renderizarTablaEsmaltes(cargasEsmalte);

    } else {
        modeVinilica.classList.add('active');
        modeEsmalte.classList.remove('active');
        vinilicaSection.style.display = 'block';
        esmalteSection.style.display = 'none';

        // Renderizar tabla de rondas vinílicas
        renderizarTabla();
    }
    // Reiniciar el formulario y la información al cambiar de modo
    formCarga.reset();
    infoDiv.style.display = 'none';
    mensaje.textContent = '';
    actualizarDistribucion();
    inicializarFolio();
}

// Event listeners para los botones de modo
modeEsmalte.addEventListener('click', () => cambiarModo('esmalte'));
modeVinilica.addEventListener('click', () => cambiarModo('vinilica'));

// Evento de submit del formulario
formCarga.addEventListener('submit', async e => {
    e.preventDefault();

    const codigo = codigoInput.value.trim();
    if (!codigo) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Código requerido.';
        return;
    }

    const producto = await cargarProductoPorCodigo();
    if (!producto) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Producto no encontrado.';
        return;
    }

    const totalLitros = actualizarDistribucion();
    const medios = Number(mediosInput.value) || 0;
    const litros = Number(litrosInput.value) || 0;
    const galones = Number(galonesInput.value) || 0;
    const cubetas = Number(cubetasInput.value) || 0;

    if (totalLitros <= 0) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Ingresa cantidades válidas.';
        return;
    }

    const tipoPintura = modeEsmalte.classList.contains('active') ? 'esmalte' : 'vinilica';
    const cargaParaLista = {
        folio: generarFolioTemporal(),
        codigoPintura: codigo,
        totalLitros: totalLitros,
        fecha: new Date().toLocaleDateString(),
        tipoOrden: 'madre',
        categoria: producto.categoria,
        cubetas: cubetas,
        galones: galones,
        litros_envase: litros,
        medios: medios,
        tipoPintura: tipoPintura
    };
    
    // Añadir propiedades específicas del producto
    if (tipoPintura === 'esmalte') {
        cargaParaLista.tipo = producto.tipo;
        cargaParaLista.es_igualacion = producto.es_igualacion;
    } else {
        cargaParaLista.numero_base = producto.numeroBase;
    }

    cargasGuardadas.push(cargaParaLista);
    guardarEstado();

    inicializarFolio();
    mensaje.style.color = 'green';
    mensaje.textContent = `Carga agregada. Folio temporal: ${cargaParaLista.folio}`;

    formCarga.reset();
    actualizarDistribucion();
    infoDiv.style.display = 'none';

    // Asignación directa para esmaltes
    if (tipoPintura === 'esmalte') {
        asignarCargasEsmalte();
    }
});


// Event Listeners
codigoInput.addEventListener('blur', cargarProductoPorCodigo);

[mediosInput, litrosInput, galonesInput, cubetasInput].forEach(input => {
    input.addEventListener('input', actualizarDistribucion);
});

document.getElementById('btnRecomendar').addEventListener('click', () => {
    fetch('http://localhost:5000/recomendar')
        .then(res => res.json())
        .then(data => {
            mostrarRecomendacion(data);
        })
        .catch(error => {
            console.error('Error getting recommendations:', error);
            document.getElementById('tablaRondas').innerHTML = '<p class="error-message">Error al cargar las recomendaciones. Asegúrese de que el servidor de Python esté funcionando.</p>';
        });
});

function mostrarRecomendacion(data) {
    const contenedor = document.getElementById('tablaRondas');
    contenedor.innerHTML = '';

    if (data.length === 0) {
        contenedor.innerHTML = '<p class="info-message">No hay recomendaciones en este momento.</p>';
        return;
    }

    let html = '<h3>Orden de Recomendación</h3>';
    html += '<table class="recommendation-table">';
    html += '<thead><tr>' +
        '<th>Color</th><th>Familia</th><th>Artículo</th><th>Descripción</th>' +
        '<th>Existencia Actual</th><th>Salidas</th><th>Alcance (días)</th>' +
        '<th>Litros Pedido</th><th>Cubetas</th><th>Galones</th><th>Litros</th>' +
        '</tr></thead><tbody>';

    data.forEach(row => {
        html += `<tr>
            <td>${row.Color}</td>
            <td>${row.Familia}</td>
            <td>${row.Articulo}</td>
            <td>${row.Descripcion}</td>
            <td>${row.Existencia_Actual}</td>
            <td>${row.Salidas}</td>
            <td>${row.Alcance_Calculado_dias}</td>
            <td>${row.Pedido_Recomendado_litros}</td>
            <td>${row.Pedido_Cubetas}</td>
            <td>${row.Pedido_Galones}</td>
            <td>${row.Pedido_Litros}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    contenedor.innerHTML = html;
}

// ====== Funciones para el Modal y Asignación de rondas ======

function mostrarCargasEnModal() {
    const cargasParaModal = JSON.parse(localStorage.getItem('cargasGuardadas')) || [];
    cargasTableBody.innerHTML = '';
    
    const modoActivo = modeEsmalte.classList.contains('active') ? 'esmalte' : 'vinilica';
    const cargasFiltradas = cargasParaModal.filter(c => c.tipoPintura === modoActivo);

    if (cargasFiltradas.length > 0) {
        const cargasOrdenadas = cargasFiltradas.sort((a, b) => {
            if (a.tipoPintura === 'vinilica') {
                return a.numero_base - b.numero_base;
            }
            return 0; // No ordenar esmaltes por ahora
        });
        
        const folioBase = generarFolioBase();
        cargasOrdenadas.forEach((carga, index) => {
            const numero = String(index + 1).padStart(3, "0");
            carga.folio = `${folioBase}${numero}`;
        });
        
        localStorage.setItem('cargasGuardadas', JSON.stringify(cargasParaModal));
        
        cargasOrdenadas.forEach(carga => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${carga.folio}</td>
                <td>${carga.codigoPintura}</td>
                <td>${carga.tipoPintura === 'vinilica' ? carga.numero_base : carga.tipo}</td>
                <td>${carga.totalLitros.toFixed(2)} L</td>
                <td>${carga.fecha}</td>
            `;
            cargasTableBody.appendChild(row);
        });

        if (modoActivo === 'vinilica') {
            asignarRondasBtn.style.display = 'inline-block';
            if (btnAsignarEsmaltes) btnAsignarEsmaltes.style.display = 'none';
        } else {
            asignarRondasBtn.style.display = 'none';
            if (btnAsignarEsmaltes) btnAsignarEsmaltes.style.display = 'inline-block';
        }

    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center;">No hay cargas guardadas.</td>`;
        cargasTableBody.appendChild(row);
        asignarRondasBtn.style.display = 'none';
        if (btnAsignarEsmaltes) btnAsignarEsmaltes.style.display = 'none';
    }
    modalCargas.style.display = 'flex';
}

function asignarRondas() {
    let cargasPendientes = JSON.parse(localStorage.getItem('cargasGuardadas')) || [];
    let cargasVinilicasPendientes = cargasPendientes.filter(c => c.tipoPintura === 'vinilica');

    if (cargasVinilicasPendientes.length === 0) {
        alert('No hay cargas de pintura vinílica pendientes para asignar.');
        return;
    }

    reorganizarCalendario(cargasVinilicasPendientes);
    
    const cargasDeEsmalte = cargasPendientes.filter(c => c.tipoPintura === 'esmalte');
    localStorage.setItem('cargasGuardadas', JSON.stringify([...cargasDeEsmalte, ...cargasGuardadas]));


    alert('Cargas asignadas y calendario reorganizado correctamente.');
    modalCargas.style.display = 'none';
    
    renderizarTabla();
}

function asignarCargasEsmalte() {
    const cargasEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
    
    // Separar cargas por tipo
    const cargasUnaEtapa = cargasEsmalte.filter(c => c.tipo === 'Igualacion' || c.es_igualacion);
    const cargasMultiplesEtapas = cargasEsmalte.filter(c => c.tipo !== 'Igualacion' && !c.es_igualacion);

    // Limpiar asignaciones previas para una nueva asignación
    cargasEsmalte.forEach(c => {
        delete c.asignadoTerminado;
        delete c.asignadoMolienda;
    });

    indiceTerminado = 0;
    indiceMoliendaPreparado = 0;

    // Asignar cargas de una sola etapa
    cargasUnaEtapa.forEach(carga => {
        carga.asignadoTerminado = equipoTerminado[indiceTerminado];
        indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
    });

    // Asignar cargas de múltiples etapas
    cargasMultiplesEtapas.forEach(carga => {
        carga.asignadoMolienda = equipoMoliendaPreparado[indiceMoliendaPreparado];
        indiceMoliendaPreparado = (indiceMoliendaPreparado + 1) % equipoMoliendaPreparado.length;
        
        carga.asignadoTerminado = equipoTerminado[indiceTerminado];
        indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
    });
    
    // Actualizar la vista de la tabla de esmaltes
    renderizarTablaEsmaltes(cargasEsmalte);

    // Borrar las cargas de esmalte de la lista principal
    cargasGuardadas = cargasGuardadas.filter(c => c.tipoPintura !== 'esmalte');
    guardarEstado(); // Guardar el nuevo estado con las asignaciones y sin las cargas de esmalte pendientes
}


function reorganizarCalendario(nuevasCargas) {
    // 1. Recopilar todas las cargas **vinílicas** existentes y las nuevas en un solo array
    let todasLasCargasVinilicas = [];
    for (const maquina in mapaMaquinaRondas) {
        for (const ronda in mapaMaquinaRondas[maquina]) {
            todasLasCargasVinilicas = todasLasCargasVinilicas.concat(mapaMaquinaRondas[maquina][ronda]);
        }
    }
    todasLasCargasVinilicas = todasLasCargasVinilicas.concat(nuevasCargas);

    // 2. Ordenar todas las cargas por NUMERO DE BASE de forma numérica.
    todasLasCargasVinilicas.sort((a, b) => a.numero_base - b.numero_base);

    // 3. Reasignar los folios para que coincidan con el orden de asignación
    const folioBase = generarFolioBase();
    todasLasCargasVinilicas.forEach((carga, index) => {
        const numero = String(index + 1).padStart(3, "0");
        carga.folio = `${folioBase}${numero}`;
    });

    // 4. Limpiar el calendario actual para la nueva asignación
    maquinas.forEach(m => {
        for (let r = 1; r <= rondasTotales; r++) {
            mapaMaquinaRondas[m][r] = [];
        }
    });

    // 5. Reasignar todas las cargas en el nuevo orden, buscando el mejor lugar
    const cargasNoAsignadas = [];
    todasLasCargasVinilicas.forEach(carga => {
        let mejorMaquina = null;
        let mejorRonda = null;
        let mejorPuntuacion = Infinity;

        // Primero, busca un lugar que respete la regla de "mismo código en la misma máquina"
        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            for (const maquina of maquinas) {
                const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];
                const litrosEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
                const capacidadMaquina = capacidadesMaquinas[maquina];
                const isSameCode = cargasEnRonda.length > 0 && cargasEnRonda[0].codigoPintura === carga.codigoPintura;

                if (isSameCode && (litrosEnRonda + carga.totalLitros) <= capacidadMaquina) {
                    const puntuacion = capacidadMaquina - (litrosEnRonda + carga.totalLitros);
                    if (puntuacion < mejorPuntuacion) {
                        mejorMaquina = maquina;
                        mejorRonda = ronda;
                        mejorPuntuacion = puntuacion;
                    }
                }
            }
        }
        
        // Si no se encontró un lugar con el mismo código, busca el mejor lugar en general (sin mezclar códigos)
        if (mejorMaquina === null) {
            for (let ronda = 1; ronda <= rondasTotales; ronda++) {
                for (const maquina of maquinas) {
                    const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];
                    const litrosEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
                    const capacidadMaquina = capacidadesMaquinas[maquina];
                    
                    // Asegúrate de que no haya cargas del mismo código
                    const isNotMixed = cargasEnRonda.length === 0;

                    if (isNotMixed && carga.totalLitros <= capacidadMaquina) {
                        const puntuacion = capacidadMaquina - carga.totalLitros;
                        if (puntuacion < mejorPuntuacion) {
                            mejorMaquina = maquina;
                            mejorRonda = ronda;
                            mejorPuntuacion = puntuacion;
                        }
                    }
                }
            }
        }

        // Si se encontró un lugar, asigna la carga.
        if (mejorMaquina && mejorRonda) {
            const cargaCompleta = {
                ...carga,
                litrosAsignados: carga.totalLitros,
                tipoOrden: 'madre'
            };
            mapaMaquinaRondas[mejorMaquina][mejorRonda].push(cargaCompleta);
        } else {
            cargasNoAsignadas.push(carga);
            console.warn(`No se pudo reasignar la carga ${carga.folio}. No hay espacio disponible.`);
        }
    });

    // 6. Actualizar las listas finales
    const cargasDeEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
    cargasGuardadas = [...cargasDeEsmalte, ...cargasNoAsignadas];
    localStorage.setItem('cargasGuardadas', JSON.stringify(cargasGuardadas));

    // 7. Guardar el estado completo del calendario
    guardarEstado();
}

// ====== Initialization ======
window.onload = () => {
    cargarEstado();
    inicializarFolio();
    actualizarDistribucion();
    if (modeVinilica.classList.contains('active')) {
        renderizarTabla();
    } else {
        const cargasEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
        renderizarTablaEsmaltes(cargasEsmalte);
    }
};

// --- Drag and Drop ---
function habilitarDragAndDrop() {
    const cards = document.querySelectorAll('.carga-card');
    const dropzones = document.querySelectorAll('.dropzone');

    let draggedItem = null;

    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            draggedItem = card;
            setTimeout(() => {
                card.style.opacity = '0.5';
            }, 0);
        });

        card.addEventListener('dragend', () => {
            draggedItem.style.opacity = '1';
            draggedItem = null;
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('over');

            if (draggedItem) {
                const oldMaquina = draggedItem.dataset.maquina;
                const oldRonda = parseInt(draggedItem.dataset.ronda);
                const newMaquina = dropzone.dataset.maquina;
                const newRonda = parseInt(dropzone.dataset.ronda);
                const draggedFolio = draggedItem.dataset.folio;

                const oldCargas = mapaMaquinaRondas[oldMaquina][oldRonda];
                const indexToRemove = oldCargas.findIndex(c => c.folio === draggedFolio);

                if (indexToRemove > -1) {
                    const cargaToMove = oldCargas.splice(indexToRemove, 1)[0];
                    const capacidadNuevaMaquina = capacidadesMaquinas[newMaquina];
                    const cargasEnNuevaRonda = mapaMaquinaRondas[newMaquina][newRonda];
                    const totalEnNuevaRonda = cargasEnNuevaRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
                    const isSameCode = cargasEnNuevaRonda.every(c => c.codigoPintura === cargaToMove.codigoPintura) || cargasEnNuevaRonda.length === 0;

                    if (
                        (totalEnNuevaRonda + cargaToMove.litrosAsignados) <= capacidadNuevaMaquina &&
                        (cargasEnNuevaRonda.length < 2 || isSameCode)
                    ) {
                        mapaMaquinaRondas[newMaquina][newRonda].push(cargaToMove);
                        draggedItem.dataset.maquina = newMaquina;
                        draggedItem.dataset.ronda = newRonda;
                        guardarEstado();
                        renderizarTabla();
                    } else {
                        console.warn("Cannot move load: capacity exceeded or mixing rules violated.");
                        oldCargas.splice(indexToRemove, 0, cargaToMove);
                        renderizarTabla();
                    }
                }
            }
        });
    });
}

document.getElementById('exportarWord').addEventListener('click', async function() {
    const exportButton = this;
    const originalText = exportButton.innerHTML;
    
    try {
        loadingOverlay.style.display = 'flex';
        exportButton.textContent = 'Generando...';
        exportButton.disabled = true;
        
        const todasLasCargas = [];
        for (const maquina in mapaMaquinaRondas) {
            for (const ronda in mapaMaquinaRondas[maquina]) {
                mapaMaquinaRondas[maquina][ronda]
                    .filter(c => c.tipoOrden === 'madre')
                    .forEach(carga => {
                        todasLasCargas.push({
                            folio: carga.folio,
                            codigoPintura: carga.codigoPintura,
                            litrosAsignados: carga.litrosAsignados,
                            dispersor: maquina,
                            rondaAsignada: ronda,
                            medios: carga.medios || 0,
                            litros_envase: carga.litros_envase || 0,
                            galones: carga.galones || 0,
                            cubetas: carga.cubetas || 0
                        });
                    });
            }
        }

        while (todasLasCargas.length < 8) {
            todasLasCargas.push(null);
        }

        const response = await fetch('http://localhost:5000/generate-identificadores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                cargas: todasLasCargas,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Identificadores_Ordenes_${new Date().toISOString().slice(0, 10)}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            alert('El archivo de Word ha sido generado y descargado correctamente.');
        } else {
            const errorText = await response.text();
            alert(`Error al generar el archivo de Word: ${errorText}`);
        }
    } catch (error) {
        console.error("Error during Word export:", error);
        alert('Ocurrió un error inesperado al generar el archivo. Por favor, revisa la consola para más detalles.');
    } finally {
        loadingOverlay.style.display = 'none';
        exportButton.textContent = originalText;
        exportButton.disabled = false;
    }
});

// Event Listeners for Modal
verCargasButton.addEventListener('click', () => {
    // Si el modo es vinílica, muestra el modal de cargas pendientes.
    if (modeVinilica.classList.contains('active')) {
        mostrarCargasEnModal();
    } else {
        // Si el modo es esmalte, no hace nada, la asignación es directa.
        alert('En el modo Esmalte, las cargas se asignan automáticamente al agregar.');
    }
});

closeModalButton.addEventListener('click', () => {
    modalCargas.style.display = 'none';
});

asignarRondasBtn.addEventListener('click', () => {
    modalCargas.style.display = 'none';
    asignarRondas();
});

window.addEventListener('click', (event) => {
    if (event.target === modalCargas) {
        modalCargas.style.display = 'none';
    }
});