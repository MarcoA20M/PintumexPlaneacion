package com.pintumex.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rotacion_personal_maquina",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"id_personal", "id_maquina", "semana", "anio"})})
public class RotacionPersonalMaquina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_personal", nullable = false)
    private Personal personal;

    @ManyToOne
    @JoinColumn(name = "id_maquina", nullable = false)
    private Maquina maquina;

    @Column(nullable = false)
    private Integer semana;

 @Column(name = "año", nullable = false)
private Integer anio;

    // Getters y setters
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Personal getPersonal() {
        return personal;
    }
    public void setPersonal(Personal personal) {
        this.personal = personal;
    }
    public Maquina getMaquina() {
        return maquina;
    }
    public void setMaquina(Maquina maquina) {
        this.maquina = maquina;
    }
    public Integer getSemana() {
        return semana;
    }
    public void setSemana(Integer semana) {
        this.semana = semana;
    }
    public Integer getAnio() {
        return anio;
    }
    public void setAnio(Integer anio) {
        this.anio = anio;
    }
}
