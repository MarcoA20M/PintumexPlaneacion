package com.pintumex.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pintumex.api.model.RotacionPersonalMaquina;

public interface RotacionPersonalMaquinaRepository extends JpaRepository<RotacionPersonalMaquina, Integer> {
    List<RotacionPersonalMaquina> findByMaquina_NombreAndSemanaAndAño(String maquinaNombre, Integer semana, Integer año);
}