package com.pintumex.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.ProductoMateria;
import com.pintumex.api.service.ProductoMateriaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos-materias")
public class ProductoMateriaController {

    @Autowired
    private ProductoMateriaService productoMateriaService;

    @GetMapping
    public List<ProductoMateria> getAllRelaciones() {
        return productoMateriaService.getAllRelaciones();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoMateria> getRelacionById(@PathVariable Integer id) {
        Optional<ProductoMateria> relacion = productoMateriaService.getRelacionById(id);
        return relacion.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductoMateria createRelacion(@RequestBody ProductoMateria relacion) {
        return productoMateriaService.saveRelacion(relacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoMateria> updateRelacion(@PathVariable Integer id, @RequestBody ProductoMateria relacion) {
        Optional<ProductoMateria> existing = productoMateriaService.getRelacionById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        relacion.setId(id);
        ProductoMateria updated = productoMateriaService.saveRelacion(relacion);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRelacion(@PathVariable Integer id) {
        productoMateriaService.deleteRelacion(id);
        return ResponseEntity.noContent().build();
    }
}
