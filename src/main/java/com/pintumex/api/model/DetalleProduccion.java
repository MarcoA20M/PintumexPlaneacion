package com.pintumex.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "detalle_produccion")
public class DetalleProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idDetalleProduccion")  // Debe coincidir con el nombre exacto en la tabla
    private Integer idDetalleProduccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idOrdenProduccion", nullable = false)  // FK que referencia orden_produccion(idOrdenProduccion)
    private OrdenProduccion ordenProduccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idMateriaPrima", nullable = false)   // FK que referencia materias_primas(idMateriaPrima)
    private MateriaPrima materiaPrima;

    @Column(name = "cantidad_usada", nullable = false)
    private Double cantidadUsada;

    public DetalleProduccion() {}

    public Integer getIdDetalleProduccion() {
        return idDetalleProduccion;
    }

    public void setIdDetalleProduccion(Integer idDetalleProduccion) {
        this.idDetalleProduccion = idDetalleProduccion;
    }

    public OrdenProduccion getOrdenProduccion() {
        return ordenProduccion;
    }

    public void setOrdenProduccion(OrdenProduccion ordenProduccion) {
        this.ordenProduccion = ordenProduccion;
    }

    public MateriaPrima getMateriaPrima() {
        return materiaPrima;
    }

    public void setMateriaPrima(MateriaPrima materiaPrima) {
        this.materiaPrima = materiaPrima;
    }

    public Double getCantidadUsada() {
        return cantidadUsada;
    }

    public void setCantidadUsada(Double cantidadUsada) {
        this.cantidadUsada = cantidadUsada;
    }
}
