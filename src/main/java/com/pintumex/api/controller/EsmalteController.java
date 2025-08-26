package com.pintumex.api.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pintumex.api.model.Esmalte;
import com.pintumex.api.repository.EsmalteRepository;

@RestController
@RequestMapping("/api/esmaltes")
public class EsmalteController {

    @Autowired
    private EsmalteRepository esmalteRepository;

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Esmalte> getEsmalteByCodigo(@PathVariable String codigo) {
        return esmalteRepository.findByCodigo(codigo)
                .map(esmalte -> ResponseEntity.ok().body(esmalte))
                .orElse(ResponseEntity.notFound().build());
    }

    

    
}