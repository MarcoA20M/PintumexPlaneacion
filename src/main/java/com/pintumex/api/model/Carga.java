package com.pintumex.api.model;

import java.util.Objects;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cargas")
public class Carga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCarga")
    private Integer idCarga;

    @Column(name = "codigo", nullable = false, length = 50)
    private String codigo;

    @Column(name = "descripcion", nullable = false, length = 255)
    private String descripcion;

    @Column(name = "categoria", nullable = false, length = 50)
    private String categoria;

    @Column(name = "prioridad", nullable = false)
    private Integer prioridad;

    @Column(name = "numero_base") // <-- Nuevo campo para el número de base
    private Integer numeroBase;

    @Column(name = "litros", nullable = false)
    private Double litros;

    @Column(name = "maquina_codigo", length = 10)
    private String maquinaCodigo;

    @Column(name = "ronda")
    private Integer ronda;

    @Column(name = "semana")
    private Integer semana;

    @Column(name = "anio")
    private Integer anio;

    // Constructor vacío
    public Carga() {
    }

    // Constructor con todos los campos excepto idCarga y maquina_codigo, ronda, semana, anio
    public Carga(String codigo, String descripcion, String categoria, Integer prioridad, Integer numeroBase, Double litros) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.prioridad = prioridad;
        this.numeroBase = numeroBase;
        this.litros = litros;
    }

    // Getters y setters

    public Integer getIdCarga() {
        return idCarga;
    }

    public void setIdCarga(Integer idCarga) {
        this.idCarga = idCarga;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Integer prioridad) {
        this.prioridad = prioridad;
    }
    
    // Nuevo getter y setter para numeroBase
    public Integer getNumeroBase() {
        return numeroBase;
    }

    public void setNumeroBase(Integer numeroBase) {
        this.numeroBase = numeroBase;
    }

    public Double getLitros() {
        return litros;
    }

    public void setLitros(Double litros) {
        this.litros = litros;
    }

    public String getMaquinaCodigo() {
        return maquinaCodigo;
    }

    public void setMaquinaCodigo(String maquinaCodigo) {
        this.maquinaCodigo = maquinaCodigo;
    }

    public Integer getRonda() {
        return ronda;
    }

    public void setRonda(Integer ronda) {
        this.ronda = ronda;
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

    // equals y hashCode basados en idCarga

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Carga)) return false;
        Carga carga = (Carga) o;
        return Objects.equals(idCarga, carga.idCarga);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idCarga);
    }

    // toString para debug
    @Override
    public String toString() {
        return "Carga{" +
                "idCarga=" + idCarga +
                ", codigo='" + codigo + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", categoria='" + categoria + '\'' +
                ", prioridad=" + prioridad +
                ", numeroBase=" + numeroBase + // <-- Incluimos numeroBase en toString
                ", litros=" + litros +
                ", maquinaCodigo='" + maquinaCodigo + '\'' +
                ", ronda=" + ronda +
                ", semana=" + semana +
                ", anio=" + anio +
                '}';
    }
}