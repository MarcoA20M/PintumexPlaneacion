// ====== Configuración inicial ======
const categoriasPrioridad = {
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
    "Directos": 16
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

// Modal Elements
const verCargasButton = document.getElementById('verCargas');
const modalCargas = document.getElementById('modalCargas');
const closeModalButton = document.getElementById('closeModal');
const cargasTableBody = document.querySelector('#cargasTable tbody');
const asignarRondasBtn = document.getElementById('btnAsignarRondas');

// ====== Funciones auxiliares ======

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
}

let consecutivoDiario = 1;
let fechaActualFolio = "";

function generarFolioBase() {
    const hoy = new Date();
    const anio = String(hoy.getFullYear()).slice(-2);
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `V${anio}${mes}${dia}`;
}

function generarFolioDiario() {
    const fechaString = generarFolioBase();
    if (fechaString !== fechaActualFolio) {
        consecutivoDiario = 1;
        fechaActualFolio = fechaString;
    }
    const numero = String(consecutivoDiario).padStart(3, "0");
    consecutivoDiario++;
    return `${fechaString}${numero}`;
}

function inicializarFolio() {
    folioInput.value = generarFolioDiario();
    consecutivoDiario--;
}

// ====== Helper Functions ======

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

function asignarCargaSegunPrioridad(nuevaCarga) {
    const { litrosAsignados, prioridad, codigoPintura } = nuevaCarga;

    const maquinas2400 = ["VI-108", "VI-104"];
    const maquina1600 = "VI-107";
    const maquinas850 = ["VI-101", "VI-102", "VI-103", "VI-105", "VI-106"];

    function hayEspacio(maquina, ronda) {
        const capacidadMaquina = capacidadesMaquinas[maquina];
        const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];
        const totalEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
        
        if ((totalEnRonda + litrosAsignados) > capacidadMaquina) {
            return false;
        }

        if (cargasEnRonda.length >= 2 && cargasEnRonda.every(c => c.codigoPintura !== codigoPintura)) {
            return false;
        }
        
        return true;
    }

    if (litrosAsignados === 1600) {
        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            if (hayEspacio(maquina1600, ronda)) {
                return { maquina: maquina1600, ronda };
            }
        }
        return null;
    } else if (litrosAsignados > 1600) {
        for (const maquina of maquinas2400) {
            for (let ronda = 1; ronda <= rondasTotales; ronda++) {
                if (hayEspacio(maquina, ronda)) {
                    return { maquina, ronda };
                }
            }
        }
        return null;
    } else {
        const ordenRondas = prioridad <= 10 ? [1, 2, 3, 4] : [4, 3, 2, 1];
        const maquinasOrdenadas = [...maquinas850, maquina1600];

        for (let ronda of ordenRondas) {
            for (const maquina of maquinasOrdenadas) {
                if (hayEspacio(maquina, ronda)) {
                    return { maquina, ronda };
                }
            }
        }
    }

    return null;
}

async function buscarProductoPorCodigo(codigo) {
    try {
        const response = await fetch(`/api/productos/codigo/${encodeURIComponent(codigo)}`);
        if (!response.ok) throw new Error('Product not found');
        const producto = await response.json();
        
        return {
            descripcion: producto.descripcion,
            base: producto.base,
            numeroBase: producto.numeroBase,
            categoria: { 
                nombre: producto.categoria.nombre, 
                prioridad: categoriasPrioridad[producto.categoria.nombre] || 99 
            }
        };
    } catch (error) {
        console.error("Error searching product:", error);
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
        baseSpan.textContent = producto.base;
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
        mensaje.textContent = 'Product not found';
        return null;
    }
}

function calcularDistribucionLitros(totalLitros) {
    const cubetas = Math.floor(totalLitros / 19);
    let resto = totalLitros % 19;
    const galones = Math.floor(resto / 4);
    resto = resto % 4;
    const litros = Math.floor(resto / 1);
    resto = resto % 1;
    const medios = Math.round(resto / 0.5);
    return { cubetas, galones, litros, medios };
}

function calcularLitrosEnMaquinaRonda(maquina, ronda) {
    const cargas = mapaMaquinaRondas[maquina][ronda] || [];
    return cargas.reduce((total, carga) => total + (carga.litrosAsignados || 0), 0);
}

// ====== Functions to Render Round Table ======

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
                        <small>${c.categoria ? c.categoria.nombre : ''}</small>
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

// ====== Funciones para Guardar y Cargar Estado ======

function guardarEstado() {
    localStorage.setItem('mapaMaquinaRondas', JSON.stringify(mapaMaquinaRondas));
    localStorage.setItem('cargasGuardadas', JSON.stringify(cargasGuardadas));
    localStorage.setItem('consecutivoDiario', consecutivoDiario);
    localStorage.setItem('fechaActualFolio', fechaActualFolio);
}

function cargarEstado() {
    const estadoMapa = localStorage.getItem('mapaMaquinaRondas');
    const estadoCargas = localStorage.getItem('cargasGuardadas');
    const estadoConsecutivo = localStorage.getItem('consecutivoDiario');
    const estadoFecha = localStorage.getItem('fechaActualFolio');

    if (estadoMapa) {
        Object.assign(mapaMaquinaRondas, JSON.parse(estadoMapa));
    }
    if (estadoCargas) {
        // Asignar el array de cargas guardadas
        cargasGuardadas = JSON.parse(estadoCargas);
    }
    if (estadoConsecutivo) {
        consecutivoDiario = parseInt(estadoConsecutivo, 10);
    }
    if (estadoFecha) {
        fechaActualFolio = estadoFecha;
    }
}


// ====== Form and Input Event Listeners ======

document.getElementById('formCarga').addEventListener('submit', async e => {
    e.preventDefault();

    const codigo = codigoInput.value.trim();
    if (!codigo) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Code required';
        return;
    }

    const producto = await cargarProductoPorCodigo();
    if (!producto) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Product not found';
        return;
    }

    const totalLitros = actualizarDistribucion();
    const medios = Number(mediosInput.value) || 0;
    const litros = Number(litrosInput.value) || 0;
    const galones = Number(galonesInput.value) || 0;
    const cubetas = Number(cubetasInput.value) || 0;

    if (totalLitros <= 0) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Enter valid quantities';
        return;
    }

    const cargaParaLista = {
        folio: generarFolioDiario(),
        codigoPintura: codigo,
        numero_base: producto.numeroBase,
        totalLitros: totalLitros,
        fecha: new Date().toLocaleDateString(),
        tipoOrden: 'madre',
        categoria: producto.categoria,
        cubetas: cubetas,
        galones: galones,
        litros_envase: litros,
        medios: medios
    };

    cargasGuardadas.push(cargaParaLista);
    guardarEstado();

    folioInput.value = generarFolioDiario();
    mensaje.style.color = 'green';
    mensaje.textContent = `Carga agregada. Folio: ${cargaParaLista.folio}`;

    document.getElementById('formCarga').reset();
    actualizarDistribucion();
    infoDiv.style.display = 'none';
});

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
            document.getElementById('tablaRondas').innerHTML = '<p>Error loading recommendations. Make sure the Python server is running.</p>';
        });
});

function mostrarRecomendacion(data) {
    const contenedor = document.getElementById('tablaRondas');
    contenedor.innerHTML = '';

    if (data.length === 0) {
        contenedor.innerHTML = '<p>No recommendations at the moment.</p>';
        return;
    }

    let html = '<h3>Recommendation Order</h3>';
    html += '<table class="recommendation-table">';
    html += '<thead><tr>' +
        '<th>Color</th><th>Family</th><th>Article</th><th>Description</th>' +
        '<th>Current Stock</th><th>Outflows</th><th>Calculated Reach (days)</th>' +
        '<th>Order Liters</th><th>Buckets</th><th>Gallons</th><th>Liters</th>' +
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

// ====== Initialization ======
window.onload = () => {
    cargarEstado();
    const cargasAsignadasDesdeLista = localStorage.getItem('mapaMaquinaRondasAsignadas');
    if (cargasAsignadasDesdeLista) {
        Object.assign(mapaMaquinaRondas, JSON.parse(cargasAsignadasDesdeLista));
        localStorage.removeItem('mapaMaquinaRondasAsignadas');
        localStorage.removeItem('cargasAgregadas');
    }
    inicializarFolio();
    actualizarDistribucion();
    renderizarTabla();
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
        exportButton.textContent = originalText;
        exportButton.disabled = false;
    }
});


// ====== Modal Logic ======

function mostrarCargasEnModal() {
    const cargasParaModal = JSON.parse(localStorage.getItem('cargasGuardadas')) || [];
    cargasTableBody.innerHTML = ''; // Limpiamos la tabla
    
    if (cargasParaModal.length > 0) {
        const cargasOrdenadas = cargasParaModal.sort((a, b) => a.numero_base - b.numero_base);
        cargasOrdenadas.forEach(carga => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${carga.folio}</td>
                <td>${carga.codigoPintura}</td>
                <td>${carga.numero_base}</td>
                <td>${carga.totalLitros.toFixed(2)} L</td>
                <td>${carga.fecha}</td>
            `;
            cargasTableBody.appendChild(row);
        });
        asignarRondasBtn.style.display = 'inline-block';
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5" style="text-align: center;">No hay cargas guardadas.</td>`;
        cargasTableBody.appendChild(row);
        asignarRondasBtn.style.display = 'none';
    }
}

function asignarRondas() {
    let cargasPendientes = JSON.parse(localStorage.getItem('cargasGuardadas')) || [];
    
    if (cargasPendientes.length === 0) {
        alert('No hay cargas pendientes para asignar.');
        return;
    }

    reorganizarCalendario(cargasPendientes);

    alert('Cargas asignadas y calendario reorganizado correctamente.');
    modalCargas.style.display = 'none';
    
    renderizarTabla();
}


function reorganizarCalendario(nuevasCargas) {
    // 1. Recopilar todas las cargas existentes y las nuevas en un solo array
    let todasLasCargas = [];
    for (const maquina in mapaMaquinaRondas) {
        for (const ronda in mapaMaquinaRondas[maquina]) {
            todasLasCargas = todasLasCargas.concat(mapaMaquinaRondas[maquina][ronda]);
        }
    }
    todasLasCargas = todasLasCargas.concat(nuevasCargas);

    // 2. Ordenar todas las cargas por prioridad (asumiendo que menor número es mayor prioridad)
    todasLasCargas.sort((a, b) => {
        const prioridadA = a.categoria ? a.categoria.prioridad : 99;
        const prioridadB = b.categoria ? b.categoria.prioridad : 99;
        return prioridadA - prioridadB;
    });

    // 3. Limpiar el calendario actual para la nueva asignación
    maquinas.forEach(m => {
        for (let r = 1; r <= rondasTotales; r++) {
            mapaMaquinaRondas[m][r] = [];
        }
    });

    // 4. Reasignar todas las cargas en el nuevo orden, dando prioridad a las máquinas con el mismo código
    const cargasNoAsignadas = [];
    todasLasCargas.forEach(carga => {
        let asignada = false;

        // Bucle principal para buscar un lugar en las rondas
        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            
            // 4a. PRIMERO: Busca una máquina con cargas del mismo código
            for (const maquina of maquinas) {
                const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];
                if (cargasEnRonda.length > 0 && cargasEnRonda[0].codigoPintura === carga.codigoPintura) {
                    const litrosEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
                    const capacidadMaquina = capacidadesMaquinas[maquina];
                    
                    if ((litrosEnRonda + carga.totalLitros) <= capacidadMaquina) {
                        const cargaCompleta = {
                            ...carga,
                            litrosAsignados: carga.totalLitros,
                            tipoOrden: 'madre'
                        };
                        mapaMaquinaRondas[maquina][ronda].push(cargaCompleta);
                        asignada = true;
                        break; // Sale del bucle de máquinas
                    }
                }
            }
            if (asignada) break; // Sale del bucle de rondas si ya se asignó

            // 4b. SEGUNDO: Si no se asignó, busca una máquina vacía
            if (!asignada) {
                for (const maquina of maquinas) {
                    const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];
                    if (cargasEnRonda.length === 0) {
                        const capacidadMaquina = capacidadesMaquinas[maquina];

                        if (carga.totalLitros <= capacidadMaquina) {
                            const cargaCompleta = {
                                ...carga,
                                litrosAsignados: carga.totalLitros,
                                tipoOrden: 'madre'
                            };
                            mapaMaquinaRondas[maquina][ronda].push(cargaCompleta);
                            asignada = true;
                            break; // Sale del bucle de máquinas
                        }
                    }
                }
            }
            if (asignada) break; // Sale del bucle de rondas si ya se asignó
        }

        if (!asignada) {
            cargasNoAsignadas.push(carga);
            console.warn(`No se pudo reasignar la carga ${carga.folio}. No hay espacio disponible.`);
        }
    });

    // 5. Actualizar las listas finales
    localStorage.setItem('cargasGuardadas', JSON.stringify(cargasNoAsignadas));
    cargasGuardadas = cargasNoAsignadas;

    // 6. Guardar el estado completo del calendario
    guardarEstado();
}

// Event Listeners for Modal
verCargasButton.addEventListener('click', () => {
    mostrarCargasEnModal();
    modalCargas.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    modalCargas.style.display = 'none';
});

asignarRondasBtn.addEventListener('click', asignarRondas);

window.addEventListener('click', (event) => {
    if (event.target === modalCargas) {
        modalCargas.style.display = 'none';
    }
});