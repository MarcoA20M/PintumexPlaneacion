package com.pintumex.api.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.ProductoPintura;
import com.pintumex.api.repository.ProductoPinturaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoPinturaService {

    @Autowired
    private ProductoPinturaRepository productoPinturaRepository;

    public List<ProductoPintura> getAllProductos() {
        return productoPinturaRepository.findAll();
    }

    public Optional<ProductoPintura> getProductoById(Integer id) {
        return productoPinturaRepository.findById(id);
    }

    public ProductoPintura saveProducto(ProductoPintura producto) {
        return productoPinturaRepository.save(producto);
    }

    public void deleteProducto(Integer id) {
        productoPinturaRepository.deleteById(id);
    }

    public List<ProductoPintura> findByCategoriaId(Integer categoriaId) {
        return productoPinturaRepository.findByCategoria_IdCategoria(categoriaId);
    }

    

public Optional<ProductoPintura> getProductoByCodigo(String codigo) {
    return productoPinturaRepository.findByCodigo(codigo);
}



}
