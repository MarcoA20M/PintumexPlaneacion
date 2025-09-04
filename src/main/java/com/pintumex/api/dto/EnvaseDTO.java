package com.pintumex.api.dto;

public class EnvaseDTO {

    private String tipo;       // Tipo de envase: "Cubeta", "Bote", "Galón", etc.
    private double capacidad;  // Capacidad en litros, por ejemplo 0.5, 1, 4, 19

    // Constructor vacío (necesario para JSON)
    public EnvaseDTO() {
    }

    // Constructor con parámetros
    public EnvaseDTO(String tipo, double capacidad) {
        this.tipo = tipo;
        this.capacidad = capacidad;
    }

    // Getters y Setters
    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public double getCapacidad() {
        return capacidad;
    }

    public void setCapacidad(double capacidad) {
        this.capacidad = capacidad;
    }

    // toString opcional para debugging
    @Override
    public String toString() {
        return "EnvaseDTO{" +
                "tipo='" + tipo + '\'' +
                ", capacidad=" + capacidad +
                '}';
    }
}
