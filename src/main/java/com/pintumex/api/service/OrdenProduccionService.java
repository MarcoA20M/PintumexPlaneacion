package com.pintumex.api.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.OrdenProduccion;
import com.pintumex.api.repository.OrdenProduccionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenProduccionService {

    @Autowired
    private OrdenProduccionRepository ordenProduccionRepository;

    public List<OrdenProduccion> getAllOrdenes() {
        return ordenProduccionRepository.findAll();
    }

    public Optional<OrdenProduccion> getOrdenById(Integer id) {
        return ordenProduccionRepository.findById(id);
    }

    public OrdenProduccion saveOrden(OrdenProduccion orden) {
        return ordenProduccionRepository.save(orden);
    }

    public void deleteOrden(Integer id) {
        ordenProduccionRepository.deleteById(id);
    }
}
