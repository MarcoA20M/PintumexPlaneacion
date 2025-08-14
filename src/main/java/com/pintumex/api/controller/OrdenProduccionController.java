package com.pintumex.api.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.OrdenProduccion;
import com.pintumex.api.service.OrdenProduccionService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes-produccion")
public class OrdenProduccionController {

    @Autowired
    private OrdenProduccionService ordenProduccionService;

    @GetMapping
    public List<OrdenProduccion> getAllOrdenes() {
        return ordenProduccionService.getAllOrdenes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdenProduccion> getOrdenById(@PathVariable Integer id) {
        Optional<OrdenProduccion> orden = ordenProduccionService.getOrdenById(id);
        return orden.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrdenProduccion createOrden(@RequestBody OrdenProduccion ordenProduccion) {
        return ordenProduccionService.saveOrden(ordenProduccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrdenProduccion> updateOrden(@PathVariable Integer id, @RequestBody OrdenProduccion ordenProduccion) {
        Optional<OrdenProduccion> existing = ordenProduccionService.getOrdenById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        ordenProduccion.setIdOrdenProduccion(id);
        OrdenProduccion updated = ordenProduccionService.saveOrden(ordenProduccion);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrden(@PathVariable Integer id) {
        ordenProduccionService.deleteOrden(id);
        return ResponseEntity.noContent().build();
    }
}
