package com.pintumex.api.service;

import com.pintumex.api.dto.EnvaseDTO;
import com.pintumex.api.model.ProductoEnvase;
import com.pintumex.api.model.ProductoPintura;
import com.pintumex.api.repository.ProductoEnvaseRepository;
import com.pintumex.api.repository.ProductoPinturaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoEnvaseService {

    private final ProductoEnvaseRepository envaseRepository;
    private final ProductoPinturaRepository productoRepository;

    public ProductoEnvaseService(ProductoEnvaseRepository envaseRepository,
                                 ProductoPinturaRepository productoRepository) {
        this.envaseRepository = envaseRepository;
        this.productoRepository = productoRepository;
    }

    public List<EnvaseDTO> obtenerEnvasesPorCodigo(String codigoProducto) {
        ProductoPintura producto = productoRepository.findByCodigo(codigoProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + codigoProducto));

        List<ProductoEnvase> envases = envaseRepository.findByProducto(producto);

        return envases.stream()
                .map(e -> new EnvaseDTO(e.getEnvase().getTipo(), e.getEnvase().getCapacidad()))
                .collect(Collectors.toList());
    }
}
