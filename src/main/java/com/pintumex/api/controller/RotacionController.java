package com.pintumex.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pintumex.api.model.Personal;
import com.pintumex.api.service.RotacionService;

@RestController
@RequestMapping("/api/rotacion")
public class RotacionController {

    @Autowired
    private RotacionService rotacionService;

    // Ejemplo: GET /api/rotacion/personal?maquina=VI-101&semana=32&año=2025
    @GetMapping("/personal")
    public ResponseEntity<List<String>> obtenerPersonalAsignado(
            @RequestParam String maquina,
            @RequestParam Integer semana,
            @RequestParam Integer año) {
        
        List<Personal> personalAsignado = rotacionService.obtenerPersonalPorMaquinaSemana(maquina, semana, año);
        // Solo devolver los nombres para simplicidad
        List<String> nombres = personalAsignado.stream()
                                              .map(Personal::getNombre)
                                              .toList();

        return ResponseEntity.ok(nombres);
    }
}