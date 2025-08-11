package com.pintumex.api.model;


import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "materias_primas")
public class MateriaPrima {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idMateriaPrima")
    private Integer idMateriaPrima;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @OneToMany(mappedBy = "materiaPrima", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductoMateria> productoMaterias;

    public MateriaPrima() {}

    public Integer getIdMateriaPrima() {
        return idMateriaPrima;
    }

    public void setIdMateriaPrima(Integer idMateriaPrima) {
        this.idMateriaPrima = idMateriaPrima;
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

    public Set<ProductoMateria> getProductoMaterias() {
        return productoMaterias;
    }

    public void setProductoMaterias(Set<ProductoMateria> productoMaterias) {
        this.productoMaterias = productoMaterias;
    }
}
