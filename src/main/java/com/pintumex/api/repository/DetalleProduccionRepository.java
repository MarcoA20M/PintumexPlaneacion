package com.pintumex.api.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.DetalleProduccion;

@Repository
public interface DetalleProduccionRepository extends JpaRepository<DetalleProduccion, Integer> {
}
