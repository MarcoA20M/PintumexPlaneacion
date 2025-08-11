package com.pintumex.api.controller;

import com.pintumex.api.model.Carga;
import com.pintumex.api.repository.CargaRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.List;

@RestController
@RequestMapping("/api/cargas")
@CrossOrigin(origins = "*")
public class CargaController {

    private final CargaRepository cargaRepository;

    public CargaController(CargaRepository cargaRepository) {
        this.cargaRepository = cargaRepository;
    }

    /**
     * Obtener cargas sin asignar por semana y año
     */
    @GetMapping("/sin-asignar")
    public List<Carga> getCargasSinAsignar(@RequestParam int semana, @RequestParam int anio) {
        return cargaRepository.findCargasSinAsignar(semana, anio);
    }

    /**
     * Asignar una carga a una máquina y ronda
     */
    @PostMapping("/asignar")
    public Carga asignarCarga(
            @RequestParam Integer idCarga,
            @RequestParam String maquina,
            @RequestParam Integer ronda,
            @RequestParam Integer semana,
            @RequestParam Integer anio
    ) {
        // Buscar la carga
        Carga carga = cargaRepository.findById(idCarga)
                .orElseThrow(() -> new RuntimeException("Carga no encontrada"));

        // Asignar datos
        carga.setMaquinaCodigo(maquina);
        carga.setRonda(ronda);
        carga.setSemana(semana);
        carga.setAnio(anio);

        // Guardar cambios
        return cargaRepository.save(carga);
    }

  @PostMapping("/guardar")
    public Carga guardarCarga(@RequestBody Carga carga) {
        System.out.println("Carga recibida y guardada: " + carga.getCodigo());
        return cargaRepository.save(carga);
    }

    @GetMapping("/reporte")
    public List<Carga> obtenerCargasParaReporte() {
        // Obtenemos el año y la semana actuales para filtrar las cargas
        LocalDate fechaHoy = LocalDate.now();
        Integer anioActual = fechaHoy.getYear();
        Integer semanaActual = fechaHoy.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

        // Devolvemos solo las cargas de la semana actual
        return cargaRepository.findByAnioAndSemana(anioActual, semanaActual);
    }


}
