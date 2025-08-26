package com.pintumex.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "esmalte_envase")
public class EsmalteEnvase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "esmalte_id")
    private Esmalte esmalte;

    @ManyToOne
    @JoinColumn(name = "envase_id")
    private Envase envase;

    private Integer cantidadDisponible;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Esmalte getEsmalte() { return esmalte; }
    public void setEsmalte(Esmalte esmalte) { this.esmalte = esmalte; }

    public Envase getEnvase() { return envase; }
    public void setEnvase(Envase envase) { this.envase = envase; }

    public Integer getCantidadDisponible() { return cantidadDisponible; }
    public void setCantidadDisponible(Integer cantidadDisponible) { this.cantidadDisponible = cantidadDisponible; }
}
