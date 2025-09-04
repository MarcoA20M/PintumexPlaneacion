package com.pintumex.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pintumex.api.model.Carga;

public interface CargaRepository extends JpaRepository<Carga, Integer> {

    @Query(value = "SELECT * FROM cargas c " +
                   "WHERE c.maquina_codigo IS NULL", nativeQuery = true)
    List<Carga> findCargasSinAsignar();

    List<Carga> findByAnioAndSemana(Integer anio, Integer semana);
}