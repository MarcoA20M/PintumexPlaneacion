package com.pintumex.api.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.MateriaPrima;
import com.pintumex.api.service.MateriaPrimaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/materias-primas")
public class MateriaPrimaController {

    @Autowired
    private MateriaPrimaService materiaPrimaService;

    @GetMapping
    public List<MateriaPrima> getAllMaterias() {
        return materiaPrimaService.getAllMaterias();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaPrima> getMateriaById(@PathVariable Integer id) {
        Optional<MateriaPrima> materia = materiaPrimaService.getMateriaById(id);
        return materia.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public MateriaPrima createMateria(@RequestBody MateriaPrima materiaPrima) {
        return materiaPrimaService.saveMateria(materiaPrima);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaPrima> updateMateria(@PathVariable Integer id, @RequestBody MateriaPrima materiaPrima) {
        Optional<MateriaPrima> existing = materiaPrimaService.getMateriaById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        materiaPrima.setIdMateriaPrima(id);
        MateriaPrima updated = materiaPrimaService.saveMateria(materiaPrima);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMateria(@PathVariable Integer id) {
        materiaPrimaService.deleteMateria(id);
        return ResponseEntity.noContent().build();
    }
}
