package com.pintumex.api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.ProductoPintura;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoPinturaRepository extends JpaRepository<ProductoPintura, Integer> {

    List<ProductoPintura> findByCategoria_IdCategoria(Integer idCategoria);
   // ProductoPintura findByCodigo(String codigo);

Optional<ProductoPintura> findByCodigo(String codigo);

}

