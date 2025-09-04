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

    @GetMapping("/personal")
    public List<String> getPersonal(
            @RequestParam String maquina,
            @RequestParam int semana,
            @RequestParam int anio) {
        return rotacionService.obtenerOperariosPorMaquina(maquina, semana);
    }
}
