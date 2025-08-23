package com.pintumex.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.ProductoPintura;
import com.pintumex.api.service.ProductoPinturaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
public class ProductoPinturaController {

    @Autowired
    private ProductoPinturaService productoPinturaService;

    @GetMapping
    public List<ProductoPintura> getAllProductos() {
        return productoPinturaService.getAllProductos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoPintura> getProductoById(@PathVariable Integer id) {
        Optional<ProductoPintura> producto = productoPinturaService.getProductoById(id);
        return producto.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<ProductoPintura> getProductosByCategoria(@PathVariable Integer categoriaId) {
        return productoPinturaService.findByCategoriaId(categoriaId);
    }

    // Nuevo método para buscar por código
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ProductoPintura> getProductoByCodigo(@PathVariable String codigo) {
        Optional<ProductoPintura> producto = productoPinturaService.getProductoByCodigo(codigo);
        return producto.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductoPintura createProducto(@RequestBody ProductoPintura producto) {
        return productoPinturaService.saveProducto(producto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoPintura> updateProducto(@PathVariable Integer id, @RequestBody ProductoPintura producto) {
        Optional<ProductoPintura> existing = productoPinturaService.getProductoById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        producto.setIdProductos(id);
        ProductoPintura updated = productoPinturaService.saveProducto(producto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Integer id) {
        productoPinturaService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }




    
}
