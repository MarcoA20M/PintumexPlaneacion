package com.pintumex.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "orden_produccion")
public class OrdenProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idOrdenProduccion")  // Debe coincidir exactamente con la columna en la tabla
    private Integer idOrdenProduccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idProductos", nullable = false)  // Coincide con FK en la tabla orden_produccion
    private ProductoPintura producto;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "cantidad_producida", nullable = false)
    private Double cantidadProducida;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado = EstadoOrden.PENDIENTE;

    @OneToMany(mappedBy = "ordenProduccion", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DetalleProduccion> detalles;

    public OrdenProduccion() {}

    public Integer getIdOrdenProduccion() {
        return idOrdenProduccion;
    }

    public void setIdOrdenProduccion(Integer idOrdenProduccion) {
        this.idOrdenProduccion = idOrdenProduccion;
    }

    public ProductoPintura getProducto() {
        return producto;
    }

    public void setProducto(ProductoPintura producto) {
        this.producto = producto;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Double getCantidadProducida() {
        return cantidadProducida;
    }

    public void setCantidadProducida(Double cantidadProducida) {
        this.cantidadProducida = cantidadProducida;
    }

    public EstadoOrden getEstado() {
        return estado;
    }

    public void setEstado(EstadoOrden estado) {
        this.estado = estado;
    }

    public Set<DetalleProduccion> getDetalles() {
        return detalles;
    }

    public void setDetalles(Set<DetalleProduccion> detalles) {
        this.detalles = detalles;
    }
}
