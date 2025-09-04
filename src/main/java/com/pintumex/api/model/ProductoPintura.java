package com.pintumex.api.model;

import jakarta.persistence.*;
import java.util.Set;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "productos_pintura")
public class ProductoPintura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProductos")
    private Integer idProductos;

    @Column(name = "codigo", nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(name = "descripcion", nullable = false, length = 255)
    private String descripcion;

    @Column(name = "base", length = 100)
    private String base;

    @Column(name = "numero_base", length = 50)
    private String numeroBase;

    @ManyToOne
    @JoinColumn(name = "idCategoria")
    @JsonIgnoreProperties("productos")
    private CategoriaPintura categoria;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrdenProduccion> ordenesProduccion;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductoMateria> productosMaterias;

    // ✅ AÑADE ESTA RELACIÓN - ES LO ÚNICO QUE FALTABA
    @OneToMany(mappedBy = "producto", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("producto") // Evita recursividad
    private List<ProductoEnvase> envasesDisponibles;

    public ProductoPintura() {}

    public Integer getIdProductos() {
        return idProductos;
    }

    public void setIdProductos(Integer idProductos) {
        this.idProductos = idProductos;
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

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public String getNumeroBase() {
        return numeroBase;
    }

    public void setNumeroBase(String numeroBase) {
        this.numeroBase = numeroBase;
    }

    public CategoriaPintura getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaPintura categoria) {
        this.categoria = categoria;
    }

    public Set<OrdenProduccion> getOrdenesProduccion() {
        return ordenesProduccion;
    }

    public void setOrdenesProduccion(Set<OrdenProduccion> ordenesProduccion) {
        this.ordenesProduccion = ordenesProduccion;
    }

    public Set<ProductoMateria> getProductosMaterias() {
        return productosMaterias;
    }

    public void setProductosMaterias(Set<ProductoMateria> productosMaterias) {
        this.productosMaterias = productosMaterias;
    }

     public List<ProductoEnvase> getEnvasesDisponibles() {
        return envasesDisponibles;
    }

    public void setEnvasesDisponibles(List<ProductoEnvase> envasesDisponibles) {
        this.envasesDisponibles = envasesDisponibles;
    }
}
