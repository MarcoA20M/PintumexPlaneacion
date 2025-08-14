package com.pintumex.api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.ProductoMateria;

@Repository
public interface ProductoMateriaRepository extends JpaRepository<ProductoMateria, Integer> {
}
