package com.pintumex.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_envase")
public class ProductoEnvase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
 @ManyToOne
    @JoinColumn(name = "producto_id")
    @JsonIgnoreProperties("envasesDisponibles") // ← IMPORTANTE para evitar ciclos
    private ProductoPintura producto;


    @ManyToOne
    @JoinColumn(name = "envase_id")
    private Envase envase;

    private Integer cantidadDisponible; // opcional, si quieres stock

    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public ProductoPintura getProducto() {
        return producto;
    }
    public void setProducto(ProductoPintura producto) {
        this.producto = producto;
    }

    public Envase getEnvase() {
        return envase;
    }
    public void setEnvase(Envase envase) {
        this.envase = envase;
    }

    public Integer getCantidadDisponible() {
        return cantidadDisponible;
    }
    public void setCantidadDisponible(Integer cantidadDisponible) {
        this.cantidadDisponible = cantidadDisponible;
    }
}
