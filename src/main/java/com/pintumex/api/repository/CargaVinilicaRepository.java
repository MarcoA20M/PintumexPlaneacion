package com.pintumex.api.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.CargaVinilica;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CargaVinilicaRepository extends JpaRepository<CargaVinilica, Long> {
    
    // Aquí puedes definir métodos personalizados si los necesitas,
    // como buscar por código de pintura o por máquina asignada.
    // Ejemplo:
    List<CargaVinilica> findByCodigoPintura(String codigoPintura);

    List<CargaVinilica> findByFecha(LocalDate fecha);
    
}