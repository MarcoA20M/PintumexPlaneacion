// Hacemos que todo tu código sea una función global
function iniciarScriptCargas() {

    // Inicializa el mapa si no existe
    if (typeof window.mapaMaquinaRondas === 'undefined') {
        window.mapaMaquinaRondas = {};
    }

    // Cache de elementos del DOM para evitar buscarlos varias veces
    const formCarga = document.getElementById('formCarga');
    const folioInput = document.getElementById('folio');
    const codigoInput = document.getElementById('codigo');
    const mediosInput = document.getElementById('medios');
    const litrosInput = document.getElementById('litros');
    const galonesInput = document.getElementById('galones');
    const cubetasInput = document.getElementById('cubetas');

    const cantMediosSpan = document.getElementById('cantMedios');
    const cantLitrosSpan = document.getElementById('cantLitros');
    const cantGalonesSpan = document.getElementById('cantGalones');
    const cantCubetasSpan = document.getElementById('cantCubetas');

    const litrosMediosSpan = document.getElementById('litrosMedios');
    const litrosLitrosSpan = document.getElementById('litrosLitros');
    const litrosGalonesSpan = document.getElementById('litrosGalones');
    const litrosCubetasSpan = document.getElementById('litrosCubetas');
    const totalDistribucionSpan = document.getElementById('totalDistribucion');
    const litrosTotalTablaSpan = document.getElementById('litrosTotalTabla');

    const exportarVinilicasBtn = document.getElementById('exportarVinilicas');

    /**
     * Actualiza la vista de distribución y los totales.
     */
    function actualizarTotalLitros() {
        const medios = Number(mediosInput.value) || 0;
        const litros = Number(litrosInput.value) || 0;
        const galones = Number(galonesInput.value) || 0;
        const cubetas = Number(cubetasInput.value) || 0;

        const totalMedios = medios * 0.5;
        const totalLitros = litros * 1;
        const totalGalones = galones * 4;
        const totalCubetas = cubetas * 19;

        cantMediosSpan.textContent = medios;
        cantLitrosSpan.textContent = litros;
        cantGalonesSpan.textContent = galones;
        cantCubetasSpan.textContent = cubetas;

        litrosMediosSpan.textContent = totalMedios.toFixed(2);
        litrosLitrosSpan.textContent = totalLitros.toFixed(2);
        litrosGalonesSpan.textContent = totalGalones.toFixed(2);
        litrosCubetasSpan.textContent = totalCubetas.toFixed(2);

        const total = totalMedios + totalLitros + totalGalones + totalCubetas;
        totalDistribucionSpan.textContent = total.toFixed(2);
        litrosTotalTablaSpan.textContent = total.toFixed(2);
    }

    // Escucha de eventos para actualizar los totales
    [mediosInput, litrosInput, galonesInput, cubetasInput].forEach(input => {
        input.addEventListener('input', actualizarTotalLitros);
    });

    // Manejar envío del formulario
    formCarga.addEventListener('submit', function(e) {
        e.preventDefault();

        const folio = folioInput.value.trim();
        const codigoPintura = codigoInput.value.trim();

        if (!folio || !codigoPintura) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        const carga = {
            folio,
            codigoPintura,
            medios: Number(mediosInput.value) || 0,
            litros: Number(litrosInput.value) || 0,
            galones: Number(galonesInput.value) || 0,
            cubetas: Number(cubetasInput.value) || 0,
            tipoOrden: 'madre'
        };

        // Lógica para agregar la carga a la estructura de datos
        const maquina = "Maquina1";
        const ronda = "Ronda1";
        if (!window.mapaMaquinaRondas[maquina]) {
            window.mapaMaquinaRondas[maquina] = {};
        }
        if (!window.mapaMaquinaRondas[maquina][ronda]) {
            window.mapaMaquinaRondas[maquina][ronda] = [];
        }
        window.mapaMaquinaRondas[maquina][ronda].push(carga);

        alert('Carga agregada correctamente.');

        this.reset();
        actualizarTotalLitros();
    });

    // Manejar exportación del reporte de vinílicas
    exportarVinilicasBtn.addEventListener('click', async function() {
        try {
            const todasLasCargasMadre = [];

            for (const maquina in window.mapaMaquinaRondas) {
                for (const ronda in window.mapaMaquinaRondas[maquina]) {
                    const cargasRonda = window.mapaMaquinaRondas[maquina][ronda]
                        .filter(c => c.tipoOrden === 'madre')
                        .map(carga => ({
                            folio: carga.folio,
                            codigoPintura: carga.codigoPintura,
                            medios: carga.medios,
                            litros: carga.litros,
                            galones: carga.galones,
                            cubetas: carga.cubetas
                        }));
                    todasLasCargasMadre.push(...cargasRonda);
                }
            }

            if (todasLasCargasMadre.length === 0) {
                alert('No hay cargas madre para exportar.');
                return;
            }

            exportarVinilicasBtn.disabled = true;
            exportarVinilicasBtn.innerHTML = 'Exportando... <span class="loading-spinner"></span>';

            const response = await fetch('http://localhost:5000/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cargas: todasLasCargasMadre })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error en el servidor: ${response.status}\n${errorText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Reporte_Vinilicas_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            alert('Reporte exportado correctamente.');

        } catch (error) {
            console.error('Error al exportar:', error);
            alert(`Error al exportar: ${error.message}`);
        } finally {
            exportarVinilicasBtn.disabled = false;
            exportarVinilicasBtn.innerHTML = 'Exportar reporte de vinílicas';
        }
    });

    // Inicializa los totales
    actualizarTotalLitros();
}
