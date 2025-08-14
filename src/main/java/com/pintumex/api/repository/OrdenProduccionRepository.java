package com.pintumex.api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.OrdenProduccion;

@Repository
public interface OrdenProduccionRepository extends JpaRepository<OrdenProduccion, Integer> {
}
