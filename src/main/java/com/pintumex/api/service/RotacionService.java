package com.pintumex.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.Personal;
import com.pintumex.api.model.RotacionPersonalMaquina;
import com.pintumex.api.repository.RotacionPersonalMaquinaRepository;

@Service
public class RotacionService {

    @Autowired
    private RotacionPersonalMaquinaRepository rotacionRepo;

    public List<Personal> obtenerPersonalPorMaquinaSemana(String maquinaNombre, Integer semana, Integer año) {
        List<RotacionPersonalMaquina> rotaciones = rotacionRepo.findByMaquina_NombreAndSemanaAndAño(maquinaNombre, semana, año);
        return rotaciones.stream()
                         .map(RotacionPersonalMaquina::getPersonal)
                         .toList();
    }
}
