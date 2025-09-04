package com.pintumex.api.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.Personal;
import com.pintumex.api.model.RotacionPersonalMaquina;
import com.pintumex.api.repository.RotacionPersonalMaquinaRepository;

@Service
public class RotacionService {

    private final List<String> operarios = List.of("Carlos", "Luis", "Pedro", "Refugio");

    private final Map<String, List<String>> maquinasPorOperario = Map.of(
        "Carlos", List.of("VI-101", "VI-102"),
        "Luis", List.of("VI-103", "VI-104"),
        "Pedro", List.of("VI-105", "VI-106"),
        "Refugio", List.of("VI-107", "VI-108")
    );

    public List<String> obtenerOperariosPorMaquina(String nombreMaquina, int semana) {
        int index = (semana - 1) % operarios.size();
        List<String> result = new ArrayList<>();

        for (int i = 0; i < operarios.size(); i++) {
            int operarioIndex = (index + i) % operarios.size();
            String operario = operarios.get(operarioIndex);
            if (maquinasPorOperario.getOrDefault(operario, List.of()).contains(nombreMaquina)) {
                result.add(operario);
            }
        }
        return result;
    }
}
