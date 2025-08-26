package com.pintumex.api.repository;

import com.pintumex.api.model.ProductoEnvase;
import com.pintumex.api.model.ProductoPintura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoEnvaseRepository extends JpaRepository<ProductoEnvase, Integer> {
    List<ProductoEnvase> findByProducto(ProductoPintura producto);
}
