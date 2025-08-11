package com.pintumex.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.DetalleProduccion;
import com.pintumex.api.service.DetalleProduccionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/detalles-produccion")
public class DetalleProduccionController {

    @Autowired
    private DetalleProduccionService detalleProduccionService;

    @GetMapping
    public List<DetalleProduccion> getAllDetalles() {
        return detalleProduccionService.getAllDetalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleProduccion> getDetalleById(@PathVariable Integer id) {
        Optional<DetalleProduccion> detalle = detalleProduccionService.getDetalleById(id);
        return detalle.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public DetalleProduccion createDetalle(@RequestBody DetalleProduccion detalleProduccion) {
        return detalleProduccionService.saveDetalle(detalleProduccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetalleProduccion> updateDetalle(@PathVariable Integer id, @RequestBody DetalleProduccion detalleProduccion) {
        Optional<DetalleProduccion> existing = detalleProduccionService.getDetalleById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        detalleProduccion.setIdDetalleProduccion(id);
        DetalleProduccion updated = detalleProduccionService.saveDetalle(detalleProduccion);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetalle(@PathVariable Integer id) {
        detalleProduccionService.deleteDetalle(id);
        return ResponseEntity.noContent().build();
    }
}
