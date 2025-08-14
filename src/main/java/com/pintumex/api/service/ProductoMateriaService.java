package com.pintumex.api.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.ProductoMateria;
import com.pintumex.api.repository.ProductoMateriaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoMateriaService {

    @Autowired
    private ProductoMateriaRepository productoMateriaRepository;

    public List<ProductoMateria> getAllRelaciones() {
        return productoMateriaRepository.findAll();
    }

    public Optional<ProductoMateria> getRelacionById(Integer id) {
        return productoMateriaRepository.findById(id);
    }

    public ProductoMateria saveRelacion(ProductoMateria relacion) {
        return productoMateriaRepository.save(relacion);
    }

    public void deleteRelacion(Integer id) {
        productoMateriaRepository.deleteById(id);
    }
}
