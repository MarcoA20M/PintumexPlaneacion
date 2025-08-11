package com.pintumex.api.model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "personal")
public class Personal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_personal")
    private Integer idPersonal;

    @Column(nullable = false, length = 50)
    private String nombre;

    // Opcional: relación bidireccional con rotaciones
    @OneToMany(mappedBy = "personal")
    private Set<RotacionPersonalMaquina> rotaciones;

    // Getters y setters
    public Integer getIdPersonal() {
        return idPersonal;
    }
    public void setIdPersonal(Integer idPersonal) {
        this.idPersonal = idPersonal;
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
