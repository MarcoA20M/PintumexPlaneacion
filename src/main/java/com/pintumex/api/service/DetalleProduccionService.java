package com.pintumex.api.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.DetalleProduccion;
import com.pintumex.api.repository.DetalleProduccionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleProduccionService {

    @Autowired
    private DetalleProduccionRepository detalleProduccionRepository;

    public List<DetalleProduccion> getAllDetalles() {
        return detalleProduccionRepository.findAll();
    }

    public Optional<DetalleProduccion> getDetalleById(Integer id) {
        return detalleProduccionRepository.findById(id);
    }

    public DetalleProduccion saveDetalle(DetalleProduccion detalle) {
        return detalleProduccionRepository.save(detalle);
    }

    public void deleteDetalle(Integer id) {
        detalleProduccionRepository.deleteById(id);
    }
}
