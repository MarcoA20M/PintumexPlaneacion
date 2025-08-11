package com.pintumex.api.repository;



import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.CategoriaPintura;
import com.pintumex.api.model.ProductoPintura;

@Repository
public interface CategoriaPinturaRepository extends JpaRepository<CategoriaPintura, Integer> {

List<CategoriaPintura> findByIdCategoria(Integer idCategoria);
@Query("SELECT p FROM ProductoPintura p JOIN FETCH p.categoria WHERE p.codigo = :codigo")
Optional<ProductoPintura> findByCodigoConCategoria(@Param("codigo") String codigo);
}
