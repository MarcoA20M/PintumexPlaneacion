package com.pintumex.api.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.CategoriaPintura;
import com.pintumex.api.service.CategoriaPinturaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaPinturaController {

    @Autowired
    private CategoriaPinturaService categoriaPinturaService;

    @GetMapping
    public List<CategoriaPintura> getAllCategorias() {
        return categoriaPinturaService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaPintura> getCategoriaById(@PathVariable Integer id) {
        Optional<CategoriaPintura> categoria = categoriaPinturaService.getCategoriaById(id);
        return categoria.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CategoriaPintura createCategoria(@RequestBody CategoriaPintura categoria) {
        return categoriaPinturaService.saveCategoria(categoria);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaPintura> updateCategoria(@PathVariable Integer id, @RequestBody CategoriaPintura categoria) {
        Optional<CategoriaPintura> existing = categoriaPinturaService.getCategoriaById(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        categoria.setIdCategoria(id);
        CategoriaPintura updated = categoriaPinturaService.saveCategoria(categoria);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Integer id) {
        categoriaPinturaService.deleteCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
