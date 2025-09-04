package com.pintumex.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pintumex.api.model.Esmalte;

import java.util.Optional;

public interface EsmalteRepository extends JpaRepository<Esmalte, String> {
    Optional<Esmalte> findByCodigo(String codigo);

    
}