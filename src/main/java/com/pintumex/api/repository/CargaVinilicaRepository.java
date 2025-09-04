package com.pintumex.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pintumex.api.model.CargaVinilica;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CargaVinilicaRepository extends JpaRepository<CargaVinilica, Long> {
    
    List<CargaVinilica> findByCodigoPintura(String codigoPintura);

    List<CargaVinilica> findByFecha(LocalDate fecha);
    
    // --- NUEVO MÉTODO AÑADIDO ---
    // Este método buscará cargas que tengan un 'codigoPintura' en la lista proporcionada
    // Y cuya 'fecha' sea posterior a la 'minFecha' especificada.
    List<CargaVinilica> findByCodigoPinturaInAndFechaAfter(List<String> codigosPintura, LocalDate minFecha);
}
