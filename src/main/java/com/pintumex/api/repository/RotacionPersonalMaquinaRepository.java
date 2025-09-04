package com.pintumex.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pintumex.api.model.RotacionPersonalMaquina;

public interface RotacionPersonalMaquinaRepository extends JpaRepository<RotacionPersonalMaquina, Integer> {
    List<RotacionPersonalMaquina> findByMaquina_NombreAndSemanaAndAnio(String nombre, Integer semana, Integer anio);
}
