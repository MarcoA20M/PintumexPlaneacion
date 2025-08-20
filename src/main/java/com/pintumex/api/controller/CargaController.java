package com.pintumex.api.controller;

import com.pintumex.api.model.Carga;
import com.pintumex.api.repository.CargaRepository;
import com.pintumex.api.service.AsignacionCargaService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.List;

@RestController
@RequestMapping("/api/cargas")
@CrossOrigin(origins = "*")
public class CargaController {

    private final CargaRepository cargaRepository;
    private final AsignacionCargaService asignacionCargaService;

    public CargaController(CargaRepository cargaRepository, AsignacionCargaService asignacionCargaService) {
        this.cargaRepository = cargaRepository;
        this.asignacionCargaService = asignacionCargaService;
    }

    @GetMapping
    public List<Carga> getAllCargas() {
        return cargaRepository.findAll();
    }

    @GetMapping("/reporte")
    public List<Carga> obtenerCargasParaReporte() {
        LocalDate fechaHoy = LocalDate.now();
        Integer anioActual = fechaHoy.getYear();
        Integer semanaActual = fechaHoy.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

        return cargaRepository.findByAnioAndSemana(anioActual, semanaActual);
    }
    
    @PostMapping("/re-asignar")
    public List<Carga> reAsignarCargas(@RequestBody List<Carga> cargas, @RequestParam int rondas) {
        return asignacionCargaService.asignarCargas(cargas, rondas);
    }

    @PostMapping("/guardar-sesion")
    public List<Carga> guardarSesion(@RequestBody List<Carga> cargas) {
        cargaRepository.deleteAll();
        return cargaRepository.saveAll(cargas);
    }
}