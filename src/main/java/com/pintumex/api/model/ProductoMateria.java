package com.pintumex.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "producto_materia",
       uniqueConstraints = @UniqueConstraint(columnNames = {"idProducto", "idMateriaPrima"}))
public class ProductoMateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProductoMateria")  // <- Aquí el nombre exacto
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idProductos", nullable = false)

    private ProductoPintura producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idMateriaPrima", nullable = false)
    private MateriaPrima materiaPrima;

    @Column(name = "cantidad_por_unidad")
    private Double cantidadPorUnidad = 0.0;

    public ProductoMateria() {}

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

    public MateriaPrima getMateriaPrima() {
        return materiaPrima;
    }

    public void setMateriaPrima(MateriaPrima materiaPrima) {
        this.materiaPrima = materiaPrima;
    }

    public Double getCantidadPorUnidad() {
        return cantidadPorUnidad;
    }

    public void setCantidadPorUnidad(Double cantidadPorUnidad) {
        this.cantidadPorUnidad = cantidadPorUnidad;
    }
}
