package com.pintumex.api.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.pintumex.api.model.Carga;
import com.pintumex.api.repository.CargaRepository;

@Service
public class CargaService {

    private final CargaRepository cargaRepository;

    public CargaService(CargaRepository cargaRepository) {
        this.cargaRepository = cargaRepository;
    }

    /**
     * Obtiene una carga por su ID.
     * @param idCarga El ID de la carga a buscar.
     * @return Un Optional que contiene la carga si se encuentra, o vacío si no.
     */
    public Optional<Carga> getCargaById(Integer idCarga) {
        return cargaRepository.findById(idCarga);
    }

    /**
     * Guarda una carga en la base de datos.
     * @param carga La carga a guardar.
     * @return La carga guardada.
     */
    public Carga saveCarga(Carga carga) {
        return cargaRepository.save(carga);
    }
    
    /**
     * Obtiene todas las cargas sin asignar de la base de datos.
     * Esto no incluye la lógica de ordenamiento.
     * @return Una lista de cargas sin asignar.
     */
    public List<Carga> getCargasSinAsignar() {
        return cargaRepository.findCargasSinAsignar();
    }
    
    /**
     * Obtiene todas las cargas de una semana y año específicos.
     * @param anio El año de la carga.
     * @param semana La semana de la carga.
     * @return Una lista de cargas de la semana y año especificados.
     */
    public List<Carga> getCargasByAnioAndSemana(Integer anio, Integer semana) {
        return cargaRepository.findByAnioAndSemana(anio, semana);
    }
}