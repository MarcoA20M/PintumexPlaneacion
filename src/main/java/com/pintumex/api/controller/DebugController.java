package com.pintumex.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
public class DebugController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/check-envasados")
    public List<Map<String, Object>> checkEnvasados() {
        try {
            return jdbcTemplate.queryForList("SELECT * FROM producto_envase LIMIT 5");
        } catch (Exception e) {
            return List.of(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/check-envases")
    public List<Map<String, Object>> checkEnvases() {
        try {
            return jdbcTemplate.queryForList("SELECT * FROM envases LIMIT 5");
        } catch (Exception e) {
            return List.of(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/check-relation")
    public List<Map<String, Object>> checkRelation() {
        try {
            return jdbcTemplate.queryForList(
                "SELECT p.descripcion, e.tipo, e.capacidad, pe.cantidad_disponible " +
                "FROM producto_envase pe " +
                "INNER JOIN productos_pintura p ON pe.producto_id = p.idProductos " +
                "INNER JOIN envases e ON pe.envase_id = e.id " +
                "LIMIT 5"
            );
        } catch (Exception e) {
            return List.of(Map.of("error", e.getMessage()));
        }
    }
}