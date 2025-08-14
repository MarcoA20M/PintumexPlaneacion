package com.pintumex.api.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pintumex.api.model.Carga;
import com.pintumex.api.repository.CargaRepository;

@Service
public class CargaService {

    private final CargaRepository cargaRepository;

    public CargaService(CargaRepository cargaRepository) {
        this.cargaRepository = cargaRepository;
    }

    public List<Carga> getCargasSinAsignar(int semana, int anio) {
        return cargaRepository.findCargasSinAsignar(semana, anio);
    }

    // Otros métodos CRUD o de negocio que necesites
}
