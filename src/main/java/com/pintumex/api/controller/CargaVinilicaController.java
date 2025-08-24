package com.pintumex.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.CargaVinilica;
import com.pintumex.api.repository.CargaVinilicaRepository;
import com.pintumex.api.service.CargaVinilicaService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/cargas")
@CrossOrigin(origins = "http://localhost:8080") // O la URL de tu frontend
public class CargaVinilicaController {

    private final CargaVinilicaService cargaVinilicaService;
    
    @Autowired
    public CargaVinilicaController(CargaVinilicaService cargaVinilicaService) {
        this.cargaVinilicaService = cargaVinilicaService;
    }

    @PostMapping("/vinilicas")
    public ResponseEntity<List<CargaVinilica>> guardarCargasVinilicas(@RequestBody List<CargaVinilica> cargas) {
        try {
            List<CargaVinilica> cargasGuardadas = cargaVinilicaService.guardarCargas(cargas);
            return new ResponseEntity<>(cargasGuardadas, HttpStatus.CREATED);
        } catch (Exception e) {
            // Manejo de errores más detallado
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/vinilicas")
    public ResponseEntity<List<CargaVinilica>> obtenerTodasLasCargas() {
        List<CargaVinilica> cargas = cargaVinilicaService.obtenerTodasLasCargas();
        return new ResponseEntity<>(cargas, HttpStatus.OK);
    }


@GetMapping("/fecha")
    public ResponseEntity<List<CargaVinilica>> findByFecha(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        List<CargaVinilica> cargas = cargaVinilicaService.findByFecha(fecha);
        
        if (cargas.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        return ResponseEntity.ok(cargas);
    }
}