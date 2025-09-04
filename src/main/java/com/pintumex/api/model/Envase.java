package com.pintumex.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "envases")
public class Envase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tipo;      // Ej: Cubeta, Galón, Litro
    private Double capacidad; // Litros o kilos, según el caso

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public Double getCapacidad() {
        return capacidad;
    }
    public void setCapacidad(Double capacidad) {
        this.capacidad = capacidad;
    }
}
