package com.pintumex.api.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.pintumex.api.model.Carga;

@Service
public class AsignacionCargaService {

    // Capacidades por máquina
    private static final Map<String, Double> CAPACIDADES = Map.of(
        "VI-101", 1200.0,
        "VI-102", 1200.0,
        "VI-103", 1200.0,
        "VI-104", 2400.0,
        "VI-105", 1200.0,
        "VI-106", 1200.0,
        "VI-107", 1600.0,
        "VI-108", 2400.0
    );

    /**
     * Método principal para asignar cargas a máquinas y rondas
     */
    public List<Carga> asignarCargas(List<Carga> cargasSinAsignar, int rondasTotales) {
        // Primero ordenar cargas por prioridad (asc) y litros (desc)
        cargasSinAsignar.sort(Comparator.comparingInt(Carga::getPrioridad).thenComparing(Comparator.comparingDouble(Carga::getLitros).reversed()));

        // Estado para controlar litros asignados por maquina y ronda
        Map<String, Map<Integer, Double>> litrosAsignados = new HashMap<>();
        for (String maquina : CAPACIDADES.keySet()) {
            Map<Integer, Double> rondasMap = new HashMap<>();
            for (int r = 1; r <= rondasTotales; r++) {
                rondasMap.put(r, 0.0);
            }
            litrosAsignados.put(maquina, rondasMap);
        }

        for (Carga carga : cargasSinAsignar) {
            boolean asignada = false;
            // Intentar asignar empezando por ronda 1
            for (int ronda = 1; ronda <= rondasTotales && !asignada; ronda++) {
                // Priorizar máquinas grandes para cargas grandes y categorías específicas
                List<String> maquinasOrdenadas = ordenarMaquinasSegunCategoria(carga.getCategoria());

                for (String maquina : maquinasOrdenadas) {
                    double capacidad = CAPACIDADES.get(maquina);
                    double litrosEnRonda = litrosAsignados.get(maquina).get(ronda);
                    // Si cabe la carga en esa máquina y ronda
                    if (litrosEnRonda + carga.getLitros() <= capacidad) {
                        // Reglas especiales para "Directos" en máquinas grandes
                        if (categoriaEsDirectos(carga.getCategoria()) && (maquina.equals("VI-108") || maquina.equals("VI-104"))) {
                            // Verificamos si hay carga transparente ya asignada en esta ronda en esta máquina
                            if (hayCargaTransparenteEnMaquinaRonda(litrosAsignados, maquina, ronda)) {
                                // No asignamos directo aún, se pasa a siguiente ronda
                                continue;
                            }
                        }

                        // Asignamos
                        carga.setMaquinaCodigo(maquina);
                        carga.setRonda(ronda);
                        litrosAsignados.get(maquina).put(ronda, litrosEnRonda + carga.getLitros());
                        asignada = true;
                        break;
                    }
                }
            }
            if (!asignada) {
                // No cabe en ninguna máquina, podrias lanzar excepción o asignar a una cola de espera
                carga.setMaquinaCodigo("NO_ASIGNADO");
                carga.setRonda(0);
            }
        }

        return cargasSinAsignar;
    }

    private List<String> ordenarMaquinasSegunCategoria(String categoria) {
        // Prioriza máquinas grandes si categoría es Directos, sino orden natural
        if (categoriaEsDirectos(categoria)) {
            return List.of("VI-108", "VI-104", "VI-107", "VI-101", "VI-102", "VI-103", "VI-105", "VI-106");
        }
        return List.of("VI-101", "VI-102", "VI-103", "VI-104", "VI-105", "VI-106", "VI-107", "VI-108");
    }

    private boolean categoriaEsDirectos(String categoria) {
        return "Directos".equalsIgnoreCase(categoria);
    }

    private boolean hayCargaTransparenteEnMaquinaRonda(Map<String, Map<Integer, Double>> litrosAsignados, String maquina, int ronda) {
        // Aquí implementar lógica para saber si hay carga de categoría transparente ya asignada.
        // Para simplicidad asumiremos que si hay litros asignados > 0 para ese máquina y ronda, y 
        // la carga es transparente en esta máquina y ronda.
        // En implementación real debes llevar control detallado.
        // Por ahora retornamos falso para que no bloquee
        return false;
    }
}
