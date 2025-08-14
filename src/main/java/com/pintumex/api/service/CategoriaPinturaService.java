package com.pintumex.api.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pintumex.api.model.CategoriaPintura;
import com.pintumex.api.repository.CategoriaPinturaRepository;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaPinturaService {

    @Autowired
    private CategoriaPinturaRepository categoriaPinturaRepository;

    public List<CategoriaPintura> getAllCategorias() {
        return categoriaPinturaRepository.findAll();
    }

    public Optional<CategoriaPintura> getCategoriaById(Integer id) {
        return categoriaPinturaRepository.findById(id);
    }

    public CategoriaPintura saveCategoria(CategoriaPintura categoria) {
        return categoriaPinturaRepository.save(categoria);
    }

    public void deleteCategoria(Integer id) {
        categoriaPinturaRepository.deleteById(id);
    }
}
