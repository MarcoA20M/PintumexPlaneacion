package com.pintumex.api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pintumex.api.model.MateriaPrima;
import com.pintumex.api.repository.MateriaPrimaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaPrimaService {

    @Autowired
    private MateriaPrimaRepository materiaPrimaRepository;

    public List<MateriaPrima> getAllMaterias() {
        return materiaPrimaRepository.findAll();
    }

    public Optional<MateriaPrima> getMateriaById(Integer id) {
        return materiaPrimaRepository.findById(id);
    }

    public MateriaPrima saveMateria(MateriaPrima materiaPrima) {
        return materiaPrimaRepository.save(materiaPrima);
    }

    public void deleteMateria(Integer id) {
        materiaPrimaRepository.deleteById(id);
    }
}
