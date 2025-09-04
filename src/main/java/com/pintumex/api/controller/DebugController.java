package com.pintumex.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/debug")
public class DebugController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/check-db-structure")
    public String checkDBStructure() {
        try {
            List<String> tables = jdbcTemplate.queryForList(
                "SHOW TABLES", String.class);
            
            return "Tablas en BD: " + tables.toString();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    @GetMapping("/check-envasados")
    public String checkEnvasados() {
        try {
            List<String> result = jdbcTemplate.queryForList(
                "SELECT * FROM producto_envase LIMIT 5", String.class);
            
            return "Datos en producto_envase: " + result.toString();
        } catch (Exception e) {
            return "Error en producto_envase: " + e.getMessage();
        }
    }
}