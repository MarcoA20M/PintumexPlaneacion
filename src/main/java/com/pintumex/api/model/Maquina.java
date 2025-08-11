package com.pintumex.api.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "maquinas")
public class Maquina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_maquina")
    private Integer idMaquina;

    @Column(nullable = false, length = 20, unique = true)
    private String nombre;

    @OneToMany(mappedBy = "maquina")
    private Set<RotacionPersonalMaquina> rotaciones;

    // Getters y setters
    public Integer getIdMaquina() {
        return idMaquina;
    }
    public void setIdMaquina(Integer idMaquina) {
        this.idMaquina = idMaquina;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public Set<RotacionPersonalMaquina> getRotaciones() {
        return rotaciones;
    }
    public void setRotaciones(Set<RotacionPersonalMaquina> rotaciones) {
        this.rotaciones = rotaciones;
    }
}
