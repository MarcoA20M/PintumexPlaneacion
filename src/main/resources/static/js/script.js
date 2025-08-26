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

const codigoInput = document.getElementById('codigo');
const descSpan = document.getElementById('descProducto');
//const baseSpan = document.getElementById('baseProducto');
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
        
        // Borraste la variable, así que también debes borrar este bloque de código
        // que intenta usarla.
        
        categoriaSpan.textContent = producto.categoria.nombre;
        prioridadSpan.textContent = producto.categoria.prioridad;
        infoDiv.style.display = 'block';
        mensaje.textContent = '';
        return producto;
    } else {
        descSpan.textContent = '';
        // Esta línea ya la habías comentado, lo cual es correcto
        // baseSpan.textContent = '';
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

    // Renderizar encabezados
    encabezados.forEach(encabezado => {
        const div = document.createElement('div');
        div.className = 'encabezado';
        div.textContent = encabezado;
        tabla.appendChild(div);
    });

    for (const maquina of maquinas) {
        const maquinaDiv = document.createElement('div');
        maquinaDiv.className = 'maquina';

        // Obtener semana y año
        const hoy = new Date();
        const [anio, semana] = getWeekNumber(hoy);

        try {
            // Llamada al backend con parámetros codificados
            const response = await fetch(`/api/rotacion/personal?maquina=${encodeURIComponent(maquina)}&semana=${semana}&anio=${anio}`);

            if (response.ok) {
                const operarios = await response.json();
                console.log("Operarios recibidos para", maquina, ":", operarios);

                maquinaDiv.innerHTML = `
                    <div class="maquina-nombre">${maquina}</div>
                    <div class="nombre-operarios">${operarios.join(', ')}</div>
                `;
            } else {
                maquinaDiv.textContent = maquina;
                console.error("Error al obtener operarios:", response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error obteniendo operarios:', error);
            maquinaDiv.textContent = maquina;
        }

        tabla.appendChild(maquinaDiv);

        // Renderizar rondas y cargas
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
                card.dataset.cubetas = c.cubetas || 0;
                card.dataset.galones = c.galones || 0;
                card.dataset.litrosEnvase = c.litros_envase || 0;
                card.dataset.medios = c.medios || 0;
                card.dataset.numeroBase = c.numero_base || '';

                // Distribución litros
                let detailsArray = [];
                if (c.cubetas > 0) detailsArray.push(`19 - ${c.cubetas}`);
                if (c.galones > 0) detailsArray.push(`4 - ${c.galones}`);
                if (c.litros_envase > 0) detailsArray.push(`1 - ${c.litros_envase}`);
                if (c.medios > 0) detailsArray.push(`0.5 - ${c.medios}`);
                const distributionDetailsHtml = detailsArray.join(', ');

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

                // Abrir modal al hacer clic
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    abrirModalVinilica(card);
                });

                rondaDiv.appendChild(card);
            });

            tabla.appendChild(rondaDiv);
        }
    }

    // Inicializar drag & drop si existe
    if (typeof habilitarDragAndDrop === 'function') {
        habilitarDragAndDrop();
    } else {
        console.warn("La función 'habilitarDragAndDrop' no está definida.");
    }
}



// ... (código anterior sin cambios)

function renderizarTablaEsmaltes(cargas) {
    const contenedor = document.getElementById('esmalte-cards-container');
    contenedor.innerHTML = '';
    
    const cargasMadre = cargas.filter(carga => carga.tipoOrden === 'madre');

    if (cargasMadre.length === 0) {
        contenedor.innerHTML = '<p class="info-message">No hay cargas de esmalte para mostrar. 😥</p>';
        return;
    }

    // Sin ordenación, se respeta el orden de ingreso
    const cargasOrdenadas = [...cargasMadre]; 

    cargasOrdenadas.forEach(carga => {
        const card = document.createElement('div');
        card.className = 'carga-card esmalte-card';
        card.dataset.folio = carga.folio;
        card.dataset.codigo = carga.codigoPintura;
        card.dataset.tipo = carga.tipo;
        card.dataset.litros = carga.totalLitros;
        
        let distributionDetailsHtml = '';
        let detailsArray = [];

        if (carga.cubetas > 0) {
            detailsArray.push(`19 L: ${carga.cubetas}`);
        }
        if (carga.galones > 0) {
            detailsArray.push(`4 L: ${carga.galones}`);
        }
        if (carga.litros_envase > 0) {
            detailsArray.push(`1 L: ${carga.litros_envase}`);
        }
        if (carga.medios > 0) {
            detailsArray.push(`0.5 L: ${carga.medios}`);
        }

        distributionDetailsHtml = detailsArray.join(' | ');

        // Tu diseño original, ahora más compacto
        card.innerHTML = `
            <div class="header-content">
                <div class="main-code">Folio: ${carga.folio}</div>
                <div class="litros-total-circulo">${Math.round(carga.totalLitros)} L</div>
            </div>
            <div class="card-body">
                <div class="descripcion"><strong>Producto:</strong> ${carga.codigoPintura}</div>
                <div class="distribucion"><strong>Tipo:</strong> ${carga.tipo}</div>
                <div class="distribucion"><strong>Distribución:</strong> ${distributionDetailsHtml}</div>
            </div>
            <div class="card-footer">
                <div><strong>Molienda:</strong> ${carga.asignadoMolienda || 'N/A'}</div>
                <div><strong>Terminado:</strong> ${carga.asignadoTerminado || 'N/A'}</div>
            </div>
        `;
        contenedor.appendChild(card);
    });

    const personalSection = document.getElementById('personal-section');
    personalSection.innerHTML = '';
    
    if (cargasMadre.length > 0) { 
        const moliendaPersonal = cargasMadre.filter(c => c.asignadoMolienda).reduce((acc, c) => {
            acc[c.asignadoMolienda] = (acc[c.asignadoMolienda] || 0) + 1;
            return acc;
        }, {});
        
        const terminadoPersonal = cargasMadre.filter(c => c.asignadoTerminado).reduce((acc, c) => {
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
        personalSection.innerHTML = '<p class="info-message">No hay personal asignado. 😥</p>';
    }
}


function asignarCargasEsmalte() {
    let cargasEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
    
    // Primero, ordenar todas las cargas existentes por su timestamp original (folio temporal)
    cargasEsmalte.sort((a, b) => {
        const aTimestamp = a.folio.split('-')[1];
        const bTimestamp = b.folio.split('-')[1];
        return aTimestamp - bTimestamp;
    });

    // Separar cargas con asignación y sin ella
    const cargasAsignadas = cargasEsmalte.filter(c => c.asignadoMolienda || c.asignadoTerminado);
    const cargasSinAsignar = cargasEsmalte.filter(c => !c.asignadoMolienda && !c.asignadoTerminado);

    // Encontrar los índices de los últimos miembros asignados para continuar el ciclo
    let ultimoMolienda = cargasAsignadas.findLast(c => c.asignadoMolienda)?.asignadoMolienda;
    let ultimoTerminado = cargasAsignadas.findLast(c => c.asignadoTerminado)?.asignadoTerminado;
    
    let indiceMolienda = ultimoMolienda ? (equipoMoliendaPreparado.indexOf(ultimoMolienda) + 1) % equipoMoliendaPreparado.length : 0;
    let indiceTerminado = ultimoTerminado ? (equipoTerminado.indexOf(ultimoTerminado) + 1) % equipoTerminado.length : 0;
    
    // Asignar personal a las cargas que no tienen asignación
    cargasSinAsignar.forEach(carga => {
        if (carga.tipo === 'Igualacion' || carga.es_igualacion) {
            // Asignar solo a terminado para igualaciones
            carga.asignadoTerminado = equipoTerminado[indiceTerminado];
            indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
        } else {
            // Asignar a molienda y terminado para el resto
            carga.asignadoMolienda = equipoMoliendaPreparado[indiceMolienda];
            indiceMolienda = (indiceMolienda + 1) % equipoMoliendaPreparado.length;
            
            carga.asignadoTerminado = equipoTerminado[indiceTerminado];
            indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
        }
        carga.tipoOrden = 'madre';
    });

    // Unir todas las cargas y reasignar folios de manera consecutiva
    const todasLasCargasAsignadas = [...cargasAsignadas, ...cargasSinAsignar];
    
    // Asignar folios nuevos y consecutivos basándose en el orden original
    const folioBase = generarFolioBase();
    todasLasCargasAsignadas.forEach((carga, index) => {
        const numero = String(index + 1).padStart(3, "0");
        carga.folio = `${folioBase}${numero}`;
    });

    const cargasVinilicas = cargasGuardadas.filter(c => c.tipoPintura === 'vinilica');
    cargasGuardadas = [...cargasVinilicas, ...todasLasCargasAsignadas];

    guardarEstado();
    renderizarTablaEsmaltes(todasLasCargasAsignadas);
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
        
        // Asignar personal a las cargas de esmalte existentes
        asignarCargasEsmalte();
        
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
        mensaje.style.display = 'block'; // Muestra el mensaje de error
        return;
    }

    const producto = await cargarProductoPorCodigo();
    if (!producto) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Producto no encontrado.';
        mensaje.style.display = 'block'; // Muestra el mensaje de error
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
        mensaje.style.display = 'block'; // Muestra el mensaje de error
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
    
    // Muestra el mensaje de éxito y lo oculta después de 3 segundos
    mensaje.style.color = 'green';
    mensaje.textContent = 'Carga agregada. ✔️';
    mensaje.style.display = 'block'; 
    setTimeout(() => {
        mensaje.style.display = 'none';
        mensaje.textContent = ''; // Limpia el texto
    }, 3000); 

    formCarga.reset();
    actualizarDistribucion();
    infoDiv.style.display = 'none';

    // Asignación directa para esmaltes
    if (tipoPintura === 'esmalte') {
        asignarCargasEsmalte();
    }
});


verCargasButton.addEventListener('click', mostrarCargasEnModal); 
closeModalButton.addEventListener('click', () => {
    modalCargas.style.display = 'none';
});
asignarRondasBtn.addEventListener('click', asignarRondas);

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
    let cargasEsmalte = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');
    
    // Limpiar asignaciones previas
    cargasEsmalte.forEach(c => {
        delete c.asignadoTerminado;
        delete c.asignadoMolienda;
    });

    // Se reinician los índices de los equipos para una nueva asignación
    let indiceTerminado = 0;
    let indiceMoliendaPreparado = 0;
    
    // Se crean dos listas temporales para separar por tipo de proceso
    const cargasUnaEtapa = cargasEsmalte.filter(c => c.tipo === 'Igualacion' || c.es_igualacion);
    const cargasMultiplesEtapas = cargasEsmalte.filter(c => c.tipo !== 'Igualacion' && !c.es_igualacion);

    // Asignar personal a las cargas de una sola etapa
    cargasUnaEtapa.forEach(carga => {
        carga.asignadoTerminado = equipoTerminado[indiceTerminado];
        indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
    });

    // Asignar personal a las cargas de múltiples etapas
    cargasMultiplesEtapas.forEach(carga => {
        carga.asignadoMolienda = equipoMoliendaPreparado[indiceMoliendaPreparado];
        indiceMoliendaPreparado = (indiceMoliendaPreparado + 1) % equipoMoliendaPreparado.length;
        
        carga.asignadoTerminado = equipoTerminado[indiceTerminado];
        indiceTerminado = (indiceTerminado + 1) % equipoTerminado.length;
    });

    // Ahora, asigna folios y separa las cargas en "madres" e "hijas"
    const cargasConHijas = [];
    let contadorFolios = 1;
    const folioBase = generarFolioBase();

    const todasLasCargasAsignadas = [...cargasUnaEtapa, ...cargasMultiplesEtapas];
    todasLasCargasAsignadas.sort((a, b) => a.folio.localeCompare(b.folio));

    todasLasCargasAsignadas.forEach(cargaMadre => {
        // Asignar y guardar la carga "madre"
        const numeroMadre = String(contadorFolios).padStart(3, "0");
        cargaMadre.folio = `${folioBase}${numeroMadre}`;
        cargasConHijas.push(cargaMadre);
        contadorFolios++;
        
        // Crear cargas "hijas" para cada tipo de envase
        if (cargaMadre.cubetas > 0) {
            const numeroHija = String(contadorFolios).padStart(3, "0");
            cargasConHijas.push({
                ...cargaMadre, // Copiar todos los datos de la madre
                folio: `${folioBase}${numeroHija}`,
                totalLitros: cargaMadre.cubetas * 19,
                tipoOrden: 'hija',
                paquete: `Cubetas: ${cargaMadre.cubetas}`,
            });
            contadorFolios++;
        }
        if (cargaMadre.galones > 0) {
            const numeroHija = String(contadorFolios).padStart(3, "0");
            cargasConHijas.push({
                ...cargaMadre,
                folio: `${folioBase}${numeroHija}`,
                totalLitros: cargaMadre.galones * 4,
                tipoOrden: 'hija',
                paquete: `Galones: ${cargaMadre.galones}`,
            });
            contadorFolios++;
        }
        if (cargaMadre.litros_envase > 0) {
            const numeroHija = String(contadorFolios).padStart(3, "0");
            cargasConHijas.push({
                ...cargaMadre,
                folio: `${folioBase}${numeroHija}`,
                totalLitros: cargaMadre.litros_envase * 1,
                tipoOrden: 'hija',
                paquete: `Litros: ${cargaMadre.litros_envase}`,
            });
            contadorFolios++;
        }
        if (cargaMadre.medios > 0) {
            const numeroHija = String(contadorFolios).padStart(3, "0");
            cargasConHijas.push({
                ...cargaMadre,
                folio: `${folioBase}${numeroHija}`,
                totalLitros: cargaMadre.medios * 0.5,
                tipoOrden: 'hija',
                paquete: `Medios: ${cargaMadre.medios}`,
            });
            contadorFolios++;
        }
    });

    renderizarTablaEsmaltes(cargasConHijas);
    
    // Filtra las cargas guardadas para que solo queden las vinílicas
    cargasGuardadas = cargasGuardadas.filter(c => c.tipoPintura !== 'esmalte');
    guardarEstado();
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
        cambiarModo('esmalte'); // Llama a la función completa para asegurar la renderización y asignación
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

                    if (isSameCode && (totalEnNuevaRonda + (cargaToMove.litrosAsignados || 0)) <= capacidadNuevaMaquina) {
                        cargaToMove.maquinaAsignada = newMaquina;
                        cargaToMove.rondaAsignada = newRonda;
                        mapaMaquinaRondas[newMaquina][newRonda].push(cargaToMove);
                        guardarEstado();
                        renderizarTabla();
                    } else {
                        oldCargas.splice(indexToRemove, 0, cargaToMove);
                        alert("No se puede mover la carga. La capacidad de la máquina se excederá o no se puede mezclar con otro código.");
                    }
                }
            }
        });
    });
}


// Asegúrate de que este archivo sea una continuación de tu script.js
// o reemplaza la sección de exportación.

// ... (todo el código JavaScript anterior) ...

// Nuevo código para el botón de exportar
document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportarVinilicas');
    const pythonServiceUrl = 'http://localhost:5000/generate-report'; 

    const originalText = exportButton.innerHTML;
    const spinner = exportButton.querySelector('.loading-spinner');

    exportButton.addEventListener('click', async function() {
        spinner.style.display = 'inline-block';
        exportButton.textContent = 'Generando...';
        exportButton.disabled = true;
        exportButton.style.opacity = '0.7';

        try {
            // Recopilar cargas de vinílicas ya asignadas
            const cargasVinilicas = [];
            if (typeof mapaMaquinaRondas !== 'undefined') {
                for (const maquina in mapaMaquinaRondas) {
                    for (const ronda in mapaMaquinaRondas[maquina]) {
                        mapaMaquinaRondas[maquina][ronda]
                            .filter(c => c.tipoOrden === 'madre')
                            .forEach(carga => {
                                // Asegurar que los datos estén en el formato correcto
                                const envasado = carga.medios !== undefined ? {
                                    medios: carga.medios,
                                    litros_envase: carga.litros_envase,
                                    galones: carga.galones,
                                    cubetas: carga.cubetas
                                } : { medios: 0, litros_envase: 0, galones: 0, cubetas: 0 };
                                
                                cargasVinilicas.push({
                                    folio: carga.folio,
                                    codigoPintura: carga.codigoPintura,
                                    litrosAsignados: carga.litrosAsignados,
                                    dispersor: maquina,
                                    rondaAsignada: ronda,
                                    ...envasado
                                });
                            });
                    }
                }
            }
            
            // Recopilar cargas de esmaltes
            // Asume que cargasGuardadas es un array global que almacena las cargas de esmalte
            const cargasEsmaltes = cargasGuardadas.filter(c => c.tipoPintura === 'esmalte');

            // Enviar ambas listas al servidor
            const response = await fetch(pythonServiceUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cargas_vinilicas: cargasVinilicas,
                    cargas_esmaltes: cargasEsmaltes
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `Reporte_Produccion_${new Date().toISOString().split('T')[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                exportButton.innerHTML = 'Exportado ✔️';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error en el servidor: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al exportar:', error);
            exportButton.innerHTML = 'Error ❌';
            alert(`Error: ${error.message}\nVerifica que el servidor Python esté corriendo.`);
        } finally {
            spinner.style.display = 'none';
            exportButton.disabled = false;
            exportButton.style.opacity = '1';
            
            setTimeout(() => {
                exportButton.innerHTML = originalText;
            }, 3000);
        }
    });
});


// Dentro del event listener del formulario
form.addEventListener('submit', (event) => {
    event.preventDefault();

    // 1. Obtiene el elemento del mensaje
    const mensajeElemento = document.getElementById('mensaje');

    // 2. Muestra el mensaje con el texto deseado
    mensajeElemento.textContent = 'Carga agregada ✔️';
    mensajeElemento.style.display = 'block';

    // 3. Oculta el mensaje después de 3 segundos
    setTimeout(() => {
        mensajeElemento.style.display = 'none';
        mensajeElemento.textContent = ''; // Limpia el texto por si acaso
    }, 3000); // 3000 milisegundos = 3 segundos

    // Tu código para procesar la carga va aquí...
});


// ====== Funcionalidad para el Modal de Vinílicas ======

// ====== FUNCIONALIDAD PARA EL MODAL DE VINÍLICAS ======

// Función para abrir el modal con la información de la carga
function abrirModalVinilica(card) {
    const modal = document.getElementById('modalVinilica');
    const cargaData = obtenerDatosCargaDesdeCard(card);
    
    // Llenar el modal con los datos
    document.getElementById('modalFolio').textContent = cargaData.folio || 'N/A';
    document.getElementById('modalCodigo').textContent = cargaData.codigo || 'N/A';
    document.getElementById('modalBase').textContent = cargaData.numeroBase || 'N/A';
    document.getElementById('modalCategoria').textContent = cargaData.categoria || 'N/A';
    document.getElementById('modalPrioridad').textContent = cargaData.prioridad || 'N/A';
    document.getElementById('modalMaquina').textContent = cargaData.maquina || 'N/A';
    document.getElementById('modalRonda').textContent = cargaData.ronda || 'N/A';
    document.getElementById('modalLitros').textContent = `${cargaData.litros || 0} L`;
    document.getElementById('modalDistribucion').textContent = generarTextoDistribucion(cargaData);
    
    // Obtener y mostrar la descripción del producto
    obtenerDescripcionProducto(cargaData.codigo).then(descripcion => {
        document.getElementById('modalDescripcion').textContent = descripcion;
    });
    
    // Configurar botones de acción
    document.getElementById('btnEditarCarga').onclick = () => editarCarga(cargaData);
    document.getElementById('btnEliminarCarga').onclick = () => eliminarCarga(cargaData);
    
    // Mostrar el modal
    modal.style.display = 'flex';
}

// Función para obtener datos de la carga desde la card
function obtenerDatosCargaDesdeCard(card) {
    return {
        folio: card.dataset.folio,
        codigo: card.dataset.codigo,
        numeroBase: card.dataset.numeroBase,
        categoria: card.dataset.categoria,
        prioridad: card.dataset.prioridad,
        litros: card.dataset.litros,
        maquina: card.dataset.maquina,
        ronda: card.dataset.ronda,
        cubetas: card.dataset.cubetas || 0,
        galones: card.dataset.galones || 0,
        litrosEnvase: card.dataset.litrosEnvase || 0,
        medios: card.dataset.medios || 0
    };
}

// Función para obtener la descripción del producto
async function obtenerDescripcionProducto(codigo) {
    try {
        const response = await fetch(`/api/productos/codigo/${encodeURIComponent(codigo)}`);
        if (response.ok) {
            const producto = await response.json();
            return producto.descripcion || 'Descripción no disponible';
        }
        return 'Descripción no disponible';
    } catch (error) {
        console.error('Error al obtener descripción:', error);
        return 'Descripción no disponible';
    }
}

// Función para generar texto de distribución
function generarTextoDistribucion(cargaData) {
    const partes = [];
    
    if (cargaData.cubetas > 0) partes.push(`${cargaData.cubetas} cubeta(s) de 19L`);
    if (cargaData.galones > 0) partes.push(`${cargaData.galones} galón(es) de 4L`);
    if (cargaData.litrosEnvase > 0) partes.push(`${cargaData.litrosEnvase} litro(s)`);
    if (cargaData.medios > 0) partes.push(`${cargaData.medios} medio(s) de 0.5L`);
    
    return partes.length > 0 ? partes.join(', ') : 'Sin distribución específica';
}

// Función para editar carga (placeholder)
function editarCarga(cargaData) {
    console.log('Editar carga:', cargaData);
    alert(`Función de edición para ${cargaData.folio} será implementada pronto.`);
}

// Función para eliminar carga
function eliminarCarga(cargaData) {
    if (confirm(`¿Estás seguro de que quieres eliminar la carga ${cargaData.folio}?`)) {
        // Eliminar de la interfaz
        const card = document.querySelector(`.carga-card[data-folio="${cargaData.folio}"]`);
        if (card) {
            card.remove();
        }
        
        // Eliminar de las estructuras de datos
        eliminarCargaDeEstructuras(cargaData);
        
        // Cerrar el modal
        document.getElementById('modalVinilica').style.display = 'none';
        
        // Mostrar mensaje de éxito
        mostrarNotificacion(`Carga ${cargaData.folio} eliminada correctamente`, 'success');
    }
}

// Función para eliminar carga de las estructuras de datos
function eliminarCargaDeEstructuras(cargaData) {
    // Eliminar de mapaMaquinaRondas
    if (mapaMaquinaRondas[cargaData.maquina] && mapaMaquinaRondas[cargaData.maquina][cargaData.ronda]) {
        const index = mapaMaquinaRondas[cargaData.maquina][cargaData.ronda].findIndex(
            c => c.folio === cargaData.folio
        );
        if (index > -1) {
            mapaMaquinaRondas[cargaData.maquina][cargaData.ronda].splice(index, 1);
        }
    }
    
    // Eliminar de cargasGuardadas
    const index = cargasGuardadas.findIndex(c => c.folio === cargaData.folio);
    if (index > -1) {
        cargasGuardadas.splice(index, 1);
    }
    
    // Guardar estado actualizado
    guardarEstado();
}


