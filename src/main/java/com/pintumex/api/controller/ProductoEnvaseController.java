package com.pintumex.api.controller;

import com.pintumex.api.dto.EnvaseDTO;
import com.pintumex.api.service.ProductoEnvaseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos/envases")
@CrossOrigin(origins = "*")
public class ProductoEnvaseController {

    private final ProductoEnvaseService service;

    public ProductoEnvaseController(ProductoEnvaseService service) {
        this.service = service;
    }

    @GetMapping("/{codigo}")
    public List<EnvaseDTO> obtenerEnvases(@PathVariable String codigo) {
        return service.obtenerEnvasesPorCodigo(codigo);
    }
}
