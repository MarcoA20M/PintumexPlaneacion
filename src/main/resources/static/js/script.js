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

// Base de datos simulada de productos
const productosDB = {
    "TRANS-001": {
        descripcion: "Pintura Transparente Base Agua",
        base: "Base-A",
        categoria: { nombre: "Transparentes", prioridad: 1 }
    },
    "BAS-100": {
        descripcion: "Pintura Básica Blanca",
        base: "Base-B",
        categoria: { nombre: "Basicos", prioridad: 2 }
    },
    "INT-200": {
        descripcion: "Pintura Intensa Roja",
        base: "Base-C",
        categoria: { nombre: "Intensos", prioridad: 8 }
    },
    "BLAN-001": {
        descripcion: "Pintura Blanca Premium",
        base: "Base-D",
        categoria: { nombre: "Blancos", prioridad: 15 }
    },
    "INT-300": {
        descripcion: "Pintura Intensa Azul",
        base: "Base-C",
        categoria: { nombre: "Intensos", prioridad: 8 }
    }
};

const maquinas = Object.keys(capacidadesMaquinas);
const rondasTotales = 4;
const mapaMaquinaRondas = {};

// Inicializar estructura de datos
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

// ====== Funciones auxiliares ======
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return [d.getUTCFullYear(), weekNo];
}

// ====== Lógica de folios automática ======
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

// ====== Funciones de apoyo ======
function actualizarDistribucion() {
    const medios = Number(mediosInput.value) || 0;
    const litros = Number(litrosInput.value) || 0;
    const galones = Number(galonesInput.value) || 0;
    const cubetas = Number(cubetasInput.value) || 0;

    const totalLitros = (medios * 0.5) + litros + (galones * 4) + (cubetas * 19);

    // Actualizar vista
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

// ====== Función de asignación mejorada ======
function asignarCargaSegunPrioridad(nuevaCarga) {
    const { litrosAsignados, prioridad, codigoPintura } = nuevaCarga;

    const maquinas2400 = ["VI-108", "VI-104"];
    const maquina1600 = "VI-107";
    const maquinas850 = ["VI-101", "VI-102", "VI-103", "VI-105", "VI-106"];

    function hayEspacio(maquina, ronda) {
        const capacidadMaquina = capacidadesMaquinas[maquina];
        const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];

        const totalEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
        if ((totalEnRonda + litrosAsignados) > capacidadMaquina) return false;

        if (cargasEnRonda.length >= 2) return false;
        if (cargasEnRonda.length === 1 && cargasEnRonda[0].codigoPintura !== codigoPintura) return false;

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

// ====== Funciones para buscar productos y renderizar tabla ======
async function buscarProductoPorCodigo(codigo) {
    const producto = productosDB[codigo];
    if (producto) {
        return producto;
    }
    try {
        const response = await fetch(`/api/productos/codigo/${encodeURIComponent(codigo)}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        return await response.json();
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
        mensaje.textContent = 'Producto no encontrado';
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

        // Obtener operarios para esta máquina (usando semana y año actual)
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
            console.error('Error al obtener operarios:', error);
            maquinaDiv.textContent = maquina;
        }

        tabla.appendChild(maquinaDiv);

        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            const rondaDiv = document.createElement('div');
            rondaDiv.className = 'dropzone';
            rondaDiv.dataset.maquina = maquina;
            rondaDiv.dataset.ronda = ronda;

            // Filtrar solo las órdenes madre (tipoOrden: 'madre')
            const cargas = mapaMaquinaRondas[maquina][ronda].filter(c => c.tipoOrden === 'madre');

            cargas.forEach(c => {
                const card = document.createElement('div');
                card.className = 'carga-card';
                card.dataset.codigo = c.codigoPintura;
                card.dataset.categoria = c.categoria.nombre || '';
                card.dataset.prioridad = c.prioridad || 100;
                card.dataset.litros = c.litrosAsignados || 0;
                card.dataset.maquina = maquina;
                card.dataset.ronda = ronda;
                card.setAttribute('draggable', 'true');

                card.innerHTML = `
                    <strong>Folio: ${c.folio}</strong><br>
                    <strong>Código: ${c.codigoPintura}</strong><br>
                    <small>(${c.categoria.nombre})</small><br>
                    <div class="distribucion-detalles">
                        <span>Litros totales: ${(c.litrosAsignados || 0).toFixed(2)}</span>
                    </div>
                    <div class="litros-total-circulo">${(c.litrosAsignados || 0).toFixed(2)}L</div>
                `;
                rondaDiv.appendChild(card);
            });
            tabla.appendChild(rondaDiv);
        }
    }
    habilitarDragAndDrop();
}

function habilitarDragAndDrop() {
    const cargas = document.querySelectorAll('.carga-card');
    const zonas = document.querySelectorAll('.dropzone');
    let cargaArrastrada = null;

    cargas.forEach(carga => {
        carga.addEventListener('dragstart', e => {
            cargaArrastrada = carga;
            e.dataTransfer.effectAllowed = 'move';
        });

        carga.addEventListener('dragend', () => {
            cargaArrastrada = null;
        });
    });

    zonas.forEach(zona => {
        zona.addEventListener('dragover', e => {
            e.preventDefault();
            zona.classList.add('over');
        });

        zona.addEventListener('dragleave', () => {
            zona.classList.remove('over');
        });

        zona.addEventListener('drop', e => {
            e.preventDefault();
            zona.classList.remove('over');
            if (!cargaArrastrada) return;

            const codigo = cargaArrastrada.dataset.codigo;
            const maquinaOrigen = cargaArrastrada.dataset.maquina;
            const rondaOrigen = parseInt(cargaArrastrada.dataset.ronda);
            const maquinaDestino = zona.dataset.maquina;
            const rondaDestino = parseInt(zona.dataset.ronda);
            const litrosCarga = parseFloat(cargaArrastrada.dataset.litros);
            const capacidadDestino = capacidadesMaquinas[maquinaDestino];
            const litrosActualesDestino = calcularLitrosEnMaquinaRonda(maquinaDestino, rondaDestino);
            const folioCarga = cargaArrastrada.querySelector("strong").textContent.replace("Folio: ", "");
            const cargaOrigenData = mapaMaquinaRondas[maquinaOrigen][rondaOrigen].find(c => c.folio === folioCarga);

            // Validaciones
            if (litrosActualesDestino + litrosCarga > capacidadDestino) {
                alert(`No hay capacidad suficiente en ${maquinaDestino} ronda ${rondaDestino}`);
                return;
            }

            const cargasDestino = mapaMaquinaRondas[maquinaDestino][rondaDestino];
            if (cargasDestino.length >= 2) {
                alert(`Máximo 2 cargas por máquina`);
                return;
            }

            if (cargasDestino.length > 0 && cargasDestino[0].codigoPintura !== codigo) {
                alert(`Solo se permiten cargas con el mismo código en una máquina`);
                return;
            }

            // Mover la carga
            mapaMaquinaRondas[maquinaOrigen][rondaOrigen] =
                mapaMaquinaRondas[maquinaOrigen][rondaOrigen].filter(c => c.folio !== folioCarga);

            mapaMaquinaRondas[maquinaDestino][rondaDestino].push({ ...cargaOrigenData, maquinaAsignada: maquinaDestino, ronda: rondaDestino });
            renderizarTabla();
        });
    });
}

document.getElementById('exportarWord').addEventListener('click', () => {

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Usamos fetch para obtener el contenido del archivo CSS
    fetch('/css/estilos_word.css')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo estilos_word.css');
            }
            return response.text();
        })
        .then(cssText => {
            const estilos = `<style>${cssText}</style>`;

            // FUNCIÓN MODIFICADA
            function generarTablaEncabezado(cargaMadre, index) {
                const folio = esc(cargaMadre.folio);
                const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                const lote = esc(cargaMadre.folio);
                const codigoPintura = esc(cargaMadre.codigoPintura);
                const litrosEnvasado = calcularDistribucionLitros(cargaMadre.litrosAsignados || 0);

                return `
                    <table class="header-table" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th colspan="2" class="title-cell">Material en Proceso</th>
                                <th colspan="2" class="title-cell">FOLIO: ${folio}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colspan="4" class="blue-bar"></td></tr>
                            <tr>
                                <td class="label-cell" rowspan="3">Fecha:</td>
                                <td rowspan="3">${fecha}</td>
                                <th colspan="2" class="blue-header-cell">ENVASADO</th>
                            </tr>
                            <tr><td>1/4</td><td></td></tr>
                            <tr><td>1/2</td><td>${litrosEnvasado.medios > 0 ? litrosEnvasado.medios : ''}</td></tr>
                            <tr><td colspan="4" class="blue-bar"></td></tr>
                            <tr>
                                <td class="label-cell" rowspan="2">Lote:</td>
                                <td rowspan="2">${lote}</td>
                                <td>1</td><td>${litrosEnvasado.litros > 0 ? litrosEnvasado.litros : ''}</td>
                            </tr>
                            <tr><td>4</td><td>${litrosEnvasado.galones > 0 ? litrosEnvasado.galones : ''}</td></tr>
                            <tr><td colspan="4" class="blue-bar"></td></tr>
                            <tr>
                                <td class="label-cell" rowspan="2">Línea:</td>
                                <td rowspan="2">${codigoPintura}</td>
                                <td>18</td><td></td>
                            </tr>
                            <tr><td>19</td><td>${litrosEnvasado.cubetas > 0 ? litrosEnvasado.cubetas : ''}</td></tr>
                            <tr><td colspan="4" class="blue-bar"></td></tr>
                            <tr>
                                <td class="label-cell">Litraje:</td>
                                <td colspan="2"></td>
                                <td>${(cargaMadre.litrosAsignados || 0).toFixed(2)}</td>
                            </tr>
                            <tr><td colspan="4" class="blue-bar"></td></tr>
                        </tbody>
                    </table>
                `;
            }

            const cargasMadre = [];
            for (const maquina in mapaMaquinaRondas) {
                for (const ronda in mapaMaquinaRondas[maquina]) {
                    mapaMaquinaRondas[maquina][ronda].forEach(carga => {
                        if (carga.tipoOrden === 'madre') {
                            cargasMadre.push(carga);
                        }
                    });
                }
            }

            let tablasHTML = '';
            for (let i = 0; i < cargasMadre.length; i += 2) {
                const carga1 = cargasMadre[i];
                const carga2 = cargasMadre[i + 1];

                let tabla1HTML = generarTablaEncabezado(carga1, 0);
                let tabla2HTML = carga2 ? generarTablaEncabezado(carga2, 1) : '';

                tablasHTML += `
                    <table class="container-table" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>${tabla1HTML}</td>
                            <td>${tabla2HTML}</td>
                        </tr>
                    </table>
                `;
            }

            if (cargasMadre.length === 0) {
                tablasHTML = `<p>No hay cargas madre para exportar.</p>`;
            }

            const htmlWord = `
                <html>
                    <head>
                        <meta charset="utf-8" />
                        <title>Distribución de Carga</title>
                        ${estilos}
                    </head>
                    <body>
                        ${tablasHTML}
                    </body>
                </html>
            `;

            const blob = new Blob(['\ufeff', htmlWord], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const folio = esc(document.getElementById('folio').value || '');
            const safeFolio = folio ? folio.replace(/[^a-zA-Z0-9_\-]/g, '') : 'SinFolio';
            link.download = `Distribucion_${safeFolio}.doc`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error al cargar el archivo CSS:', error);
            alert('Hubo un error al exportar el documento. Por favor, asegúrate de que el archivo estilos_word.css está en el mismo directorio.');
        });
});

document.getElementById('exportarVinilicas').addEventListener('click', () => {

    const ws_data = [];

    // --- Encabezado del reporte ---
    ws_data.push(['REPORTE DIARIO DE PRODUCCION VINILICAS']);
    const fecha = new Date();
    ws_data.push([`FECHA: domingo, ${fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`]);
    ws_data.push([]); // Fila vacía
    
    // --- Títulos de las columnas ---
    const headers = [
        'R', 'OP', 'LOTE', 'CARGA', 'LITROS', 'DISPERSOR', 'FOLIO TINA',
        '1', '4', '18', '19', '0.5', 'ADUANA', 'TRASPASO', 'OBSERVACIONES'
    ];
    ws_data.push(headers);

    // --- Recolectar todas las cargas madre y aplanarlas en un solo array ---
    const todasLasCargasMadre = [];
    for (const maquina in mapaMaquinaRondas) {
        for (const ronda in mapaMaquinaRondas[maquina]) {
            mapaMaquinaRondas[maquina][ronda]
                .filter(c => c.tipoOrden === 'madre')
                .forEach(carga => {
                    todasLasCargasMadre.push({
                        ...carga,
                        maquinaAsignada: maquina,
                        rondaAsignada: ronda
                    });
                });
        }
    }
    
    // Rellenar hasta 36 cargas si no hay suficientes, para que el formato sea constante.
    while (todasLasCargasMadre.length < 36) {
        todasLasCargasMadre.push(null);
    }

    // --- Llenar las filas del reporte de Excel ---
    let rowIndex = 0;
    const gruposDeFilas = [
        { inicioRonda: 1, finRonda: 6 },
        { inicioRonda: 11, finRonda: 15 },
        { inicioRonda: 21, finRonda: 25 },
        { inicioRonda: 31, finRonda: 36 }
    ];

    gruposDeFilas.forEach(grupo => {
        for (let i = grupo.inicioRonda; i <= grupo.finRonda; i++) {
            const carga = todasLasCargasMadre[rowIndex];
            const row = new Array(headers.length).fill('');
            row[0] = i; // Columna 'R' (Ronda)

            if (carga) {
                const distribucion = calcularDistribucionLitros(carga.litrosAsignados);
                row[2] = carga.folio;
                row[3] = carga.codigoPintura;
                row[4] = carga.litrosAsignados.toFixed(2);
                row[5] = carga.maquinaAsignada;
                row[7] = distribucion.litros > 0 ? distribucion.litros : '';
                row[8] = distribucion.galones > 0 ? distribucion.galones : '';
                row[10] = distribucion.cubetas > 0 ? distribucion.cubetas : '';
                row[11] = distribucion.medios > 0 ? distribucion.medios : '';
            }

            ws_data.push(row);
            rowIndex++;
        }
    });

    // --- Crear el libro de Excel y aplicar estilos básicos ---
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Definir anchos de columnas
    const col_widths = [
        { wch: 3 },  // R
        { wch: 5 },  // OP
        { wch: 15 }, // LOTE
        { wch: 15 }, // CARGA
        { wch: 10 }, // LITROS
        { wch: 10 }, // DISPERSOR
        { wch: 12 }, // FOLIO TINA
        { wch: 5 },  // 1
        { wch: 5 },  // 4
        { wch: 5 },  // 18
        { wch: 5 },  // 19
        { wch: 5 },  // 0.5
        { wch: 10 }, // ADUANA
        { wch: 10 }, // TRASPASO
        { wch: 20 }  // OBSERVACIONES
    ];
    ws['!cols'] = col_widths;

    // Combinar celdas para el encabezado (como en la imagen)
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // Título principal
        { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }  // Fecha
    ];
    
    // Añadir hoja al libro y guardar
    XLSX.utils.book_append_sheet(wb, ws, "Reporte Vinílicas");
    XLSX.writeFile(wb, "Reporte_Produccion_Vinilicas.xlsx");
});

// ====== Event Listeners ======
document.getElementById('formCarga').addEventListener('submit', async e => {
    e.preventDefault();

    const codigo = codigoInput.value.trim();
    if (!codigo) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Código requerido';
        return;
    }

    const producto = await cargarProductoPorCodigo();
    if (!producto) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Producto no encontrado';
        return;
    }

    const totalLitros = actualizarDistribucion();
    const medios = Number(mediosInput.value) || 0;
    const litros = Number(litrosInput.value) || 0;
    const galones = Number(galonesInput.value) || 0;
    const cubetas = Number(cubetasInput.value) || 0;

    if (totalLitros <= 0) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Ingrese cantidades válidas';
        return;
    }

    // 1. Crear la orden madre (litraje total)
    const folioMadre = generarFolioDiario();
    const cargaMadre = {
        folio: folioMadre,
        codigoPintura: codigo,
        litrosAsignados: totalLitros,
        categoria: producto.categoria,
        prioridad: producto.categoria.prioridad,
        tipoOrden: 'madre',
        cantidadUnidades: 'Total'
    };

    // Asignar y agregar la orden madre
    const asignacionMadre = asignarCargaSegunPrioridad(cargaMadre);
    if (!asignacionMadre) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'No hay espacio disponible para la orden madre.';
        // Revertir el folio para que pueda ser re-usado en el siguiente intento
        consecutivoDiario--;
        return;
    }
    mapaMaquinaRondas[asignacionMadre.maquina][asignacionMadre.ronda].push(cargaMadre);

    // 2. Crear las órdenes hijas (unidades de distribución) - pero no las mostramos en la tabla
    const unidades = [
        { tipo: 'medios', cantidad: medios, litros: 0.5 },
        { tipo: 'litros', cantidad: litros, litros: 1 },
        { tipo: 'galones', cantidad: galones, litros: 4 },
        { tipo: 'cubetas', cantidad: cubetas, litros: 19 }
    ];

    for (const unidad of unidades) {
        if (unidad.cantidad > 0) {
            const folioHija = generarFolioDiario();
            const cargaHija = {
                folio: folioHija,
                codigoPintura: codigo,
                litrosAsignados: unidad.cantidad * unidad.litros,
                categoria: producto.categoria,
                prioridad: producto.categoria.prioridad,
                tipoOrden: 'hija',
                cantidadUnidades: `${unidad.cantidad} ${unidad.tipo}`
            };

            // Asignar y agregar la orden hija (aunque no se mostrará)
            const asignacionHija = asignarCargaSegunPrioridad(cargaHija);
            if (!asignacionHija) {
                mensaje.style.color = 'red';
                mensaje.textContent = `No hay espacio para la orden hija de ${unidad.tipo}.`;
                consecutivoDiario--; // Revertir el folio
                return;
            }
            mapaMaquinaRondas[asignacionHija.maquina][asignacionHija.ronda].push(cargaHija);
        }
    }

    // Generar el siguiente folio y mostrarlo
    folioInput.value = generarFolioDiario();
    mensaje.style.color = 'green';
    mensaje.textContent = `Órdenes agregadas. Folio madre: ${cargaMadre.folio}`;

    renderizarTabla();
});

// Evento para buscar producto al perder foco
codigoInput.addEventListener('blur', cargarProductoPorCodigo);

// Eventos para actualizar distribución
[mediosInput, litrosInput, galonesInput, cubetasInput].forEach(input => {
    input.addEventListener('input', actualizarDistribucion);
});

// Inicialización
window.onload = () => {
    inicializarFolio();
    actualizarDistribucion();
    renderizarTabla();
};

// Función para mostrar la recomendación (usa nombres exactos que devuelve backend)
function mostrarRecomendacion(data) {
    const contenedor = document.getElementById('tablaRondas');
    contenedor.innerHTML = ''; // limpiar

    if (data.length === 0) {
        contenedor.innerHTML = '<p>No hay recomendaciones por el momento.</p>';
        return;
    }

    let html = '<h3>Recomendación de Pedido</h3>';
    html += '<table border="1" style="width:100%; border-collapse: collapse;">';
    html += '<thead><tr>' +
        '<th>Color</th><th>Familia</th><th>Articulo</th><th>Descripcion</th>' +
        '<th>Existencia Actual</th><th>Salidas</th><th>Alcance Calculado (días)</th>' +
        '<th>Pedido Litros</th><th>Cubetas</th><th>Galones</th><th>Litros</th>' +
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

// Evento clic que obtiene la recomendación y muestra con la función anterior
document.getElementById('btnRecomendar').addEventListener('click', () => {
    fetch('http://localhost:5000/recomendar')
        .then(res => res.json())
        .then(data => {
            mostrarRecomendacion(data);
        })
        .catch(error => {
            console.error('Error al obtener recomendaciones:', error);
            document.getElementById('tablaRondas').innerHTML = '<p>Error al cargar recomendaciones.</p>';
        });
});