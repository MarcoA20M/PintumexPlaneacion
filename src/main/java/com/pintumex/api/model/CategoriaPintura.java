package com.pintumex.api.model;

import jakarta.persistence.*;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "categorias_pintura")
public class CategoriaPintura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCategoria")
    private Integer idCategoria;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "prioridad")  // ¡Agrega esta columna!
    private Integer prioridad;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<ProductoPintura> productos;

    public CategoriaPintura() {}

    // Getters y setters

    public Integer getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(Integer idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Integer prioridad) {
        this.prioridad = prioridad;
    }

    public Set<ProductoPintura> getProductos() {
        return productos;
    }

    public void setProductos(Set<ProductoPintura> productos) {
        this.productos = productos;
    }
}
