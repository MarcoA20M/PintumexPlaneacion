document.addEventListener('DOMContentLoaded', () => {
    const cargasAgregadas = JSON.parse(localStorage.getItem('cargasAgregadas')) || [];
    const tableBody = document.querySelector('#cargasTable tbody');
    const asignarRondasBtn = document.getElementById('btnAsignarRondas');

    // Función para mostrar las cargas en la tabla
    function mostrarCargas() {
        // Limpiamos la tabla antes de renderizar
        tableBody.innerHTML = '';
        
        if (cargasAgregadas.length > 0) {
            cargasAgregadas.forEach(carga => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${carga.folio}</td>
                    <td>${carga.codigoPintura}</td>
                    <td>${carga.numero_base}</td>
                    <td>${carga.totalLitros.toFixed(2)} L</td>
                    <td>${carga.fecha}</td>
                `;
                tableBody.appendChild(row);
            });
            asignarRondasBtn.style.display = 'inline-block';
        } else {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" style="text-align: center;">No hay cargas guardadas.</td>`;
            tableBody.appendChild(row);
            asignarRondasBtn.style.display = 'none';
        }
    }

    // Lógica para asignar las cargas a las rondas
   function asignarRondas() {
    // Ordena las cargas de menor a mayor por el número de base
    const cargasOrdenadas = cargasAgregadas.sort((a, b) => a.numero_base - b.numero_base);

    const mapaAsignacion = {};
    const maquinas = ["VI-101", "VI-102", "VI-103", "VI-105", "VI-106", "VI-107", "VI-104", "VI-108"];
    const rondasTotales = 4;
    const capacidadPorRonda = 850;
    const capacidadMaquinasEspeciales = {
        "VI-107": 1600,
        "VI-104": 2400,
        "VI-108": 2400
    };

    // Inicializa la estructura de asignación
    maquinas.forEach(m => {
        mapaAsignacion[m] = {};
        for (let r = 1; r <= rondasTotales; r++) {
            mapaAsignacion[m][r] = [];
        }
    });

    // Asigna cada carga a la primera máquina y ronda disponible
    cargasOrdenadas.forEach(carga => {
        let asignada = false;

        // Primero, busca espacio en la misma ronda para optimizar
        for (let ronda = 1; ronda <= rondasTotales; ronda++) {
            // Recorre todas las máquinas dentro de la ronda actual
            for (const maquina of maquinas) {
                const cargasEnRonda = mapaAsignacion[maquina][ronda];
                const litrosEnRonda = cargasEnRonda.reduce((acc, c) => acc + (c.litrosAsignados || 0), 0);
                const capacidadMaquina = capacidadMaquinasEspeciales[maquina] || capacidadPorRonda;
                const isSameCode = cargasEnRonda.every(c => c.codigoPintura === carga.codigoPintura) || cargasEnRonda.length === 0;

                if ((litrosEnRonda + carga.totalLitros) <= capacidadMaquina && (cargasEnRonda.length < 2 || isSameCode)) {
                    // Si cabe, la asigna inmediatamente
                    const cargaCompleta = {
                        ...carga,
                        litrosAsignados: carga.totalLitros,
                        tipoOrden: 'madre'
                    };
                    mapaAsignacion[maquina][ronda].push(cargaCompleta);
                    asignada = true;
                    break;
                }
            }
            // Si la carga fue asignada en esta ronda, pasa a la siguiente carga
            if (asignada) break;
        }

        if (!asignada) {
            console.warn(`No se pudo asignar la carga ${carga.folio}. No hay espacio disponible en ninguna ronda.`);
        }
    });

    // Guarda el mapa de asignaciones en localStorage para que el index.html lo lea
    localStorage.setItem('mapaMaquinaRondasAsignadas', JSON.stringify(mapaAsignacion));
    localStorage.removeItem('cargasAgregadas');
    alert('Cargas asignadas. Redireccionando a la página principal.');


        // Redirige a la página principal para que se muestre la tabla actualizada
        window.location.href = 'consulta_pintura.html';
    }

    // Al cargar la página, mostramos las cargas
    mostrarCargas();

    // Evento para el botón de asignar
    if (asignarRondasBtn) {
        asignarRondasBtn.addEventListener('click', asignarRondas);
    }
});