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

    // ====== Funciones auxiliares ======

    /**
     * Calculates the week number and year for a given date.
     * @param {Date} d - The date to calculate.
     * @returns {Array<number>} An array with the year and week number.
     */
    function getWeekNumber(d) {
        // Copies the date to avoid modifying the original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Sets the date to the Thursday of that week (day 4 of the UTC week)
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Gets the start of the year
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculates the week number
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    }

    // ====== Automatic Folio Logic ======
    let consecutivoDiario = 1;
    let fechaActualFolio = "";

    /**
     * Generates the base part of the folio (YearMonthDay).
     * @returns {string} The base folio string.
     */
    function generarFolioBase() {
        const hoy = new Date();
        const anio = String(hoy.getFullYear()).slice(-2); // Last 2 digits of the year
        const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // Month with 2 digits
        const dia = String(hoy.getDate()).padStart(2, "0"); // Day with 2 digits
        return `V${anio}${mes}${dia}`;
    }

    /**
     * Generates a unique daily folio. Resets the consecutive number if the day changes.
     * @returns {string} The generated folio.
     */
    function generarFolioDiario() {
        const fechaString = generarFolioBase();
        // If the date has changed, reset the daily consecutive number
        if (fechaString !== fechaActualFolio) {
            consecutivoDiario = 1;
            fechaActualFolio = fechaString;
        }
        const numero = String(consecutivoDiario).padStart(3, "0"); // Consecutive number with 3 digits
        consecutivoDiario++;
        return `${fechaString}${numero}`;
    }

    /**
     * Initializes the folio field in the form.
     */
    function inicializarFolio() {
        folioInput.value = generarFolioDiario();
        // Decrements so that the next click on "Add Load" generates the same folio
        // This is useful if the folio is pre-generated and the user is expected to use it.
        consecutivoDiario--;
    }

    // ====== Helper Functions ======

    /**
     * Updates the distribution table and calculates the total liters.
     * @returns {number} The calculated total liters.
     */
    function actualizarDistribucion() {
        const medios = Number(mediosInput.value) || 0;
        const litros = Number(litrosInput.value) || 0;
        const galones = Number(galonesInput.value) || 0;
        const cubetas = Number(cubetasInput.value) || 0;
        
        const totalLitros = (medios * 0.5) + litros + (galones * 4) + (cubetas * 19);

        // Update distribution table preview
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

    /**
     * Assigns a new load to the most suitable machine and round based on its priority and capacity.
     * @param {Object} nuevaCarga - The load object to assign.
     * @returns {Object|null} An object with the assigned machine and round, or null if no space is available.
     */
    function asignarCargaSegunPrioridad(nuevaCarga) {
        const { litrosAsignados, prioridad, codigoPintura } = nuevaCarga;

        const maquinas2400 = ["VI-108", "VI-104"];
        const maquina1600 = "VI-107";
        const maquinas850 = ["VI-101", "VI-102", "VI-103", "VI-105", "VI-106"];

        /**
         * Checks if there is available space for a load in a specific machine and round.
         * @param {string} maquina - Machine name.
         * @param {number} ronda - Round number.
         * @returns {boolean} True if space is available, false otherwise.
         */
        function hayEspacio(maquina, ronda) {
            const capacidadMaquina = capacidadesMaquinas[maquina];
            const cargasEnRonda = mapaMaquinaRondas[maquina][ronda];

            const totalEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
            
            // Debugging logs:
            // console.log(`Evaluando ${maquina}, Ronda ${ronda}: Litros a asignar=${litrosAsignados}, Total en ronda=${totalEnRonda}, Capacidad=${capacidadMaquina}, Cargas en ronda=${cargasEnRonda.length}`);

            if ((totalEnRonda + litrosAsignados) > capacidadMaquina) {
                // console.log(`  -> Capacidad excedida: ${totalEnRonda + litrosAsignados} > ${capacidadMaquina}`);
                return false;
            }

            // Limits to 2 loads per round if they have different paint codes,
            // or more than 2 if they have the same code.
            // The condition `cargasEnRonda.every(c => c.codigoPintura !== codigoPintura)` needs adjustment
            // if you intend to allow MORE THAN 2 loads of the SAME code.
            // Currently, it means: if there are already 2 or more loads AND ALL existing loads
            // have a different code than the new one, then return false.
            // If you want to strictly limit to 2 loads per round regardless of code, use `cargasEnRonda.length >= 2`.
            // If you want to allow unlimited loads of the same code but limit to 2 for different codes,
            // the current logic is close but might need fine-tuning based on edge cases.
            if (cargasEnRonda.length >= 2 && cargasEnRonda.every(c => c.codigoPintura !== codigoPintura)) {
                // console.log(`  -> Límite de cargas alcanzado o códigos de pintura diferentes.`);
                return false;
            }
            
            // Additional check: if one item already exists, and its code is different from the new one, and you want to limit to 2 items total.
            // if (cargasEnRonda.length === 1 && cargasEnRonda[0].codigoPintura !== codigoPintura) {
            //     console.log("  -> Ya hay una carga y es de código diferente.");
            //     return false;
            // }


            return true;
        }

        // Assignment logic: prioritizes large machines for large loads
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
            // For smaller loads, order rounds by priority and machines
            const ordenRondas = prioridad <= 10 ? [1, 2, 3, 4] : [4, 3, 2, 1];
            const maquinasOrdenadas = [...maquinas850, maquina1600]; // 850L first, then 1600L

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

    // ====== Product Search Functions ======

    /**
     * Searches for a product by its code via an API.
     * @param {string} codigo - The product code to search for.
     * @returns {Object|null} The product object if found, or null if not.
     */
    async function buscarProductoPorCodigo(codigo) {
        try {
            const response = await fetch(`/api/productos/codigo/${encodeURIComponent(codigo)}`);
            if (!response.ok) throw new Error('Product not found');
            const producto = await response.json();
            
            // Adapts the product structure to match what is expected by the frontend
            return {
                descripcion: producto.descripcion,
                base: producto.base,
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

    /**
     * Loads product information into the form when a code is entered.
     */
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

    // This function is no longer needed for card visualization with the new logic,
    // but is kept in case it is used elsewhere where an optimal distribution needs to be calculated.
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

    /**
     * Calculates the total liters in a given machine and round.
     * @param {string} maquina - Machine name.
     * @param {number} ronda - Round number.
     * @returns {number} The total liters.
     */
    function calcularLitrosEnMaquinaRonda(maquina, ronda) {
        const cargas = mapaMaquinaRondas[maquina][ronda] || [];
        return cargas.reduce((total, carga) => total + (carga.litrosAsignados || 0), 0);
    }

    // ====== Functions to Render Round Table ======

    /**
     * Renders or updates the rounds table with assigned loads.
     */
    async function renderizarTabla() {
        tabla.innerHTML = ''; // Clears the table before rendering
        const encabezados = ['Máquina', 'Ronda 1', 'Ronda 2', 'Ronda 3', 'Ronda 4'];

        // Creates the table headers
        encabezados.forEach(encabezado => {
            const div = document.createElement('div');
            div.className = 'encabezado';
            div.textContent = encabezado;
            tabla.appendChild(div);
        });

        // Iterates through each machine to render its rows and rounds
        for (const maquina of maquinas) {
            const maquinaDiv = document.createElement('div');
            maquinaDiv.className = 'maquina';

            // Get operators for this machine (using current week and year)
            const hoy = new Date();
            const [año, semana] = getWeekNumber(hoy);

            try {
                // This assumes you have a /api/rotacion/personal endpoint working.
                // If not, this part may fail or not display operators.
                const response = await fetch(`/api/rotacion/personal?maquina=${maquina}&semana=${semana}&año=${año}`);
                if (response.ok) {
                    const operarios = await response.json();
                    maquinaDiv.innerHTML = `
                        ${maquina}
                        <div class="nombre-operarios">${operarios.join(', ')}</div>
                    `;
                } else {
                    maquinaDiv.textContent = maquina; // Displays only the machine name if no operators
                }
            } catch (error) {
                console.error('Error getting operators:', error);
                maquinaDiv.textContent = maquina; // Displays only the machine name if there's an error
            }

            tabla.appendChild(maquinaDiv);

            // Iterates through each round for the current machine
            for (let ronda = 1; ronda <= rondasTotales; ronda++) {
                const rondaDiv = document.createElement('div');
                rondaDiv.className = 'dropzone';
                rondaDiv.dataset.maquina = maquina;
                rondaDiv.dataset.ronda = ronda;

                // Filters only mother orders assigned to this machine and round
                const cargas = mapaMaquinaRondas[maquina][ronda].filter(c => c.tipoOrden === 'madre');

                // Creates a card for each load
                cargas.forEach(c => {
                    const card = document.createElement('div');
                    card.className = 'carga-card';
                    // Stores relevant data in data-attributes for Drag & Drop or future interactions
                    card.dataset.folio = c.folio;
                    card.dataset.codigo = c.codigoPintura;
                    card.dataset.categoria = c.categoria.nombre || '';
                    card.dataset.prioridad = c.prioridad || 100;
                    card.dataset.litros = c.litrosAsignados || 0;
                    card.dataset.maquina = maquina;
                    card.dataset.ronda = ronda;
                    card.setAttribute('draggable', 'true'); // Makes the card draggable

                    // Generates the HTML for distribution details with the new format
                    let distributionDetailsHtml = '';
                    let detailsArray = [];

                    // Checks each unit type and adds it if the quantity is greater than 0
                    if (c.cubetas > 0) {
                        detailsArray.push(`19 - ${c.cubetas}`); // Muestra la cantidad de cubetas
                    }
                    if (c.galones > 0) {
                        detailsArray.push(`4 - ${c.galones}`); // Muestra la cantidad de galones
                    }
                    if (c.litros_envase > 0) { // Using litros_envase for 1L liters
                        detailsArray.push(`1 - ${c.litros_envase}`); // Muestra la cantidad de litros
                    }
                    if (c.medios > 0) {
                        detailsArray.push(`0.5 - ${c.medios}`); // Muestra la cantidad de medios
                    }

                    distributionDetailsHtml = detailsArray.join(', '); // Joins details with comma and space

                    // Builds the HTML content of the card
                    card.innerHTML = `
                        <div class="header-content">
                            <div class="main-code">Código: ${c.codigoPintura}</div>
                            <div class="litros-total-circulo">${(c.litrosAsignados || 0).toFixed(2)}L</div>
                        </div>
                        <div class="distribution-details-new">
                            ${distributionDetailsHtml}
                        </div>
                        <div class="card-footer">
                            <small>${c.categoria.nombre}</small>
                        </div>
                    `;
                    rondaDiv.appendChild(card); // Adds the card to the round
                });
                tabla.appendChild(rondaDiv); // Adds the round to the table
            }
        }
        // Calls the function to enable Drag & Drop after rendering
        // Make sure this function is defined elsewhere in your script or as a placeholder.
        if (typeof habilitarDragAndDrop === 'function') {
            habilitarDragAndDrop();
        } else {
            console.warn("The function 'habilitarDragAndDrop' is not defined. If you need drag and drop functionality, please define it.");
        }
    }

    // ====== Export Functions (kept as placeholders if not defined) ======
    // These functions assume you have the code to export to Word and Excel
    // defined elsewhere or are placeholder functions for now.
    function exportarWord() {
        console.log("Function 'exportarWord' called. Implement Word export logic.");
        // Your Word export logic would go here (e.g., using a library like Docx.js or a backend call)
    }

    // The 'exportarVinilicas' function has a part in the HTML's embedded script
    // that handles the Python backend call. It is only defined here to prevent errors.
    function exportarVinilicas() {
        console.log("Function 'exportarVinilicas' called. Python backend submission logic is executed from the HTML script.");
    }

    // ====== Form and Input Event Listeners ======

    // Listener for the "Create Load" form submission
    document.getElementById('formCarga').addEventListener('submit', async e => {
        e.preventDefault(); // Prevents traditional form submission

        const codigo = codigoInput.value.trim();
        if (!codigo) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Code required';
            return;
        }

        const producto = await cargarProductoPorCodigo(); // Attempts to load product info
        if (!producto) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Product not found';
            return;
        }

        const totalLitros = actualizarDistribucion(); // Calculates total liters based on inputs
        const medios = Number(mediosInput.value) || 0;
        const litros = Number(litrosInput.value) || 0; // Value from the 'litros' input
        const galones = Number(galonesInput.value) || 0;
        const cubetas = Number(cubetasInput.value) || 0;

        if (totalLitros <= 0) {
            mensaje.style.color = 'red';
            mensaje.textContent = 'Enter valid quantities';
            return;
        }

        // Creates the mother order object with all data
        const cargaMadre = {
            folio: generarFolioDiario(), // Generates a unique folio for this load
            codigoPintura: codigo,
            litrosAsignados: totalLitros,
            categoria: producto.categoria,
            prioridad: producto.categoria.prioridad,
            tipoOrden: 'madre', // Marks as mother order
            medios: medios,
            litros_envase: litros, // Saves the exact liters entered
            galones: galones,
            cubetas: cubetas
        };

        // Attempts to assign the load to a machine and round
        const asignacionMadre = asignarCargaSegunPrioridad(cargaMadre);
        if (!asignacionMadre) { // <--- ESTA ES LA CLAVE: Si asignacionMadre es null, no se agrega.
            mensaje.style.color = 'red';
            mensaje.textContent = 'No space available for the mother order.';
            consecutivoDiario--; // If not assigned, "undoes" the folio increment
            return;
        }
        // If assigned, adds it to the machine and round map
        mapaMaquinaRondas[asignacionMadre.maquina][asignacionMadre.ronda].push(cargaMadre);

        // Updates the folio for the next load
        folioInput.value = generarFolioDiario();
        mensaje.style.color = 'green';
        mensaje.textContent = `Orders added. Mother folio: ${cargaMadre.folio}`;

        renderizarTabla(); // Rerenders the table to display the new load
    });

    // Listener to search for a product when the code input loses focus
    codigoInput.addEventListener('blur', cargarProductoPorCodigo);

    // Listeners to update the distribution table in real time when inputs change
    [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(input => {
        input.addEventListener('input', actualizarDistribucion);
    });

    // Listener for the "Recommend Schedule" button
    document.getElementById('btnRecomendar').addEventListener('click', () => {
        // This assumes a Python backend running on localhost:5000/recomendar
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

    /**
     * Displays order recommendations in the rounds table.
     * @param {Array<Object>} data - The recommendation data.
     */
    function mostrarRecomendacion(data) {
        const contenedor = document.getElementById('tablaRondas');
        contenedor.innerHTML = '';

        if (data.length === 0) {
            contenedor.innerHTML = '<p>No recommendations at the moment.</p>';
            return;
        }

        let html = '<h3>Recommendation Order</h3>';
        html += '<table class="recommendation-table">'; // Adds a class to style the recommendation table if needed
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
    // Ensures that functions run once the DOM is fully loaded.
    window.onload = () => {
        inicializarFolio(); // Generates initial folio
        actualizarDistribucion(); // Updates initial distribution view
        renderizarTabla(); // Renders the rounds table (initially empty)
    };

    // --- Drag and Drop (Placeholder - Make sure to implement if needed) ---
    // This function should contain the logic to make cards draggable and dropzones receptive.
    function habilitarDragAndDrop() {
        // console.log("Enabling Drag and Drop...");
        // Drag and drop implementation:
        // 1. Add 'dragstart' listeners to .carga-card
        // 2. Add 'dragover', 'dragleave', 'drop' listeners to .dropzone
        // Basic example:
        const cards = document.querySelectorAll('.carga-card');
        const dropzones = document.querySelectorAll('.dropzone');

        let draggedItem = null;

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedItem = card;
                setTimeout(() => {
                    card.style.opacity = '0.5'; // Make the card semi-transparent when dragging
                }, 0);
            });

            card.addEventListener('dragend', () => {
                draggedItem.style.opacity = '1'; // Restore opacity when dropped
                draggedItem = null;
            });
        });

        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allows drop
                dropzone.classList.add('over'); // Adds a class for "drag over" visualization
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('over');
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.classList.remove('over');

                if (draggedItem) {
                    // Get data from the dragged card
                    const oldMaquina = draggedItem.dataset.maquina;
                    const oldRonda = parseInt(draggedItem.dataset.ronda);
                    const newMaquina = dropzone.dataset.maquina;
                    const newRonda = parseInt(dropzone.dataset.ronda);
                    const draggedFolio = draggedItem.dataset.folio; // Use folio to identify it

                    // Find and remove the load from the old location
                    const oldCargas = mapaMaquinaRondas[oldMaquina][oldRonda];
                    const indexToRemove = oldCargas.findIndex(c => c.folio === draggedFolio);

                    if (indexToRemove > -1) {
                        const cargaToMove = oldCargas.splice(indexToRemove, 1)[0]; // Removes and gets the load

                        // Check assignment rules before adding
                        const capacidadNuevaMaquina = capacidadesMaquinas[newMaquina];
                        const cargasEnNuevaRonda = mapaMaquinaRondas[newMaquina][newRonda];
                        const totalEnNuevaRonda = cargasEnNuevaRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);

                        // Capacity rules and number of loads per round
                        const isSameCode = cargasEnNuevaRonda.every(c => c.codigoPintura === cargaToMove.codigoPintura) || cargasEnNuevaRonda.length === 0;

                        if (
                            (totalEnNuevaRonda + cargaToMove.litrosAsignados) <= capacidadNuevaMaquina &&
                            (cargasEnNuevaRonda.length < 2 || isSameCode) // Allows more than 2 if they have the same code
                        ) {
                            // Add the load to the new location
                            mapaMaquinaRondas[newMaquina][newRonda].push(cargaToMove);

                            // Update the data attributes of the dragged card
                            draggedItem.dataset.maquina = newMaquina;
                            draggedItem.dataset.ronda = newRonda;

                            renderizarTabla(); // Rerender the entire table to reflect the change
                        } else {
                            console.warn("Cannot move load: capacity exceeded or mixing rules violated.");
                            // If it cannot be moved, re-insert the load in its original position to avoid data loss
                            oldCargas.splice(indexToRemove, 0, cargaToMove); // Puts it back
                            renderizarTabla(); // Rerender to ensure correct visual state
                        }
                    }
                }
            });
        });
    }
