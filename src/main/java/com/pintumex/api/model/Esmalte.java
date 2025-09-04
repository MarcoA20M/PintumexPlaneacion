package com.pintumex.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ESMALTES")
public class Esmalte {

    @Id
    private String codigo;
    private String descripcion;
    private String tipo;
    private boolean es_igualacion;
    private boolean preparado;
    private boolean molienda;
    private boolean terminado;

    // Getters y Setters
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
    public String getTipo() {
        return tipo;
    }
    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
    public boolean isEs_igualacion() {
        return es_igualacion;
    }
    public void setEs_igualacion(boolean es_igualacion) {
        this.es_igualacion = es_igualacion;
    }
    public boolean isPreparado() {
        return preparado;
    }
    public void setPreparado(boolean preparado) {
        this.preparado = preparado;
    }
    public boolean isMolienda() {
        return molienda;
    }
    public void setMolienda(boolean molienda) {
        this.molienda = molienda;
    }
    public boolean isTerminado() {
        return terminado;
    }
    public void setTerminado(boolean terminado) {
        this.terminado = terminado;
    }
}