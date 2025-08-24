package com.pintumex.api.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.CargaVinilica;
import com.pintumex.api.repository.CargaVinilicaRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class CargaVinilicaService {

    private final CargaVinilicaRepository cargaVinilicaRepository;

    @Autowired
    public CargaVinilicaService(CargaVinilicaRepository cargaVinilicaRepository) {
        this.cargaVinilicaRepository = cargaVinilicaRepository;
    }

    public List<CargaVinilica> guardarCargas(List<CargaVinilica> cargas) {
        // Aquí podrías agregar lógica de negocio, como validaciones o procesamiento
        // antes de guardar. Por ahora, solo delegamos la tarea al repositorio.
        return cargaVinilicaRepository.saveAll(cargas);
    }
    
    public List<CargaVinilica> obtenerTodasLasCargas() {
        return cargaVinilicaRepository.findAll();
    }

     public List<CargaVinilica> findByFecha(LocalDate fecha) {
        return cargaVinilicaRepository.findByFecha(fecha);
    }
    
    // Puedes agregar más métodos de negocio según tus necesidades
}