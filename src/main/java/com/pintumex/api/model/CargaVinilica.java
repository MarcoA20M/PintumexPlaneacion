package com.pintumex.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "cargas_vinilicas")
public class CargaVinilica implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String folio;
    private String codigoPintura;
    private Double totalLitros;
    private LocalDate fecha; // Corregido a LocalDate
    private String tipoOrden;

    // Campos para la categoría
    private String categoriaNombre;
    private Integer categoriaPrioridad;

    private Integer cubetas;
    private Integer galones;
    private Integer litrosEnvase;
    private Integer medios;
    private String tipoPintura;
    private String numeroBase;
    private String maquinaAsignada;
    private Integer rondaAsignada;

    // Constructores
    public CargaVinilica() {
    }

    public CargaVinilica(String folio, String codigoPintura, Double totalLitros, LocalDate fecha, String tipoOrden, String categoriaNombre, Integer categoriaPrioridad, Integer cubetas, Integer galones, Integer litrosEnvase, Integer medios, String tipoPintura, String numeroBase, String maquinaAsignada, Integer rondaAsignada) {
        this.folio = folio;
        this.codigoPintura = codigoPintura;
        this.totalLitros = totalLitros;
        this.fecha = fecha;
        this.tipoOrden = tipoOrden;
        this.categoriaNombre = categoriaNombre;
        this.categoriaPrioridad = categoriaPrioridad;
        this.cubetas = cubetas;
        this.galones = galones;
        this.litrosEnvase = litrosEnvase;
        this.medios = medios;
        this.tipoPintura = tipoPintura;
        this.numeroBase = numeroBase;
        this.maquinaAsignada = maquinaAsignada;
        this.rondaAsignada = rondaAsignada;
    }

    // Getters y Setters
    // (Asegúrate de que los getters y setters para 'fecha' usen LocalDate, no Date)
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFolio() {
        return folio;
    }

    public void setFolio(String folio) {
        this.folio = folio;
    }

    public String getCodigoPintura() {
        return codigoPintura;
    }

    public void setCodigoPintura(String codigoPintura) {
        this.codigoPintura = codigoPintura;
    }

    public Double getTotalLitros() {
        return totalLitros;
    }

    public void setTotalLitros(Double totalLitros) {
        this.totalLitros = totalLitros;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTipoOrden() {
        return tipoOrden;
    }

    public void setTipoOrden(String tipoOrden) {
        this.tipoOrden = tipoOrden;
    }

    public String getCategoriaNombre() {
        return categoriaNombre;
    }

    public void setCategoriaNombre(String categoriaNombre) {
        this.categoriaNombre = categoriaNombre;
    }

    public Integer getCategoriaPrioridad() {
        return categoriaPrioridad;
    }

    public void setCategoriaPrioridad(Integer categoriaPrioridad) {
        this.categoriaPrioridad = categoriaPrioridad;
    }

    public Integer getCubetas() {
        return cubetas;
    }

    public void setCubetas(Integer cubetas) {
        this.cubetas = cubetas;
    }

    public Integer getGalones() {
        return galones;
    }

    public void setGalones(Integer galones) {
        this.galones = galones;
    }

    public Integer getLitrosEnvase() {
        return litrosEnvase;
    }

    public void setLitrosEnvase(Integer litrosEnvase) {
        this.litrosEnvase = litrosEnvase;
    }

    public Integer getMedios() {
        return medios;
    }

    public void setMedios(Integer medios) {
        this.medios = medios;
    }

    public String getTipoPintura() {
        return tipoPintura;
    }

    public void setTipoPintura(String tipoPintura) {
        this.tipoPintura = tipoPintura;
    }

    public String getNumeroBase() {
        return numeroBase;
    }

    public void setNumeroBase(String numeroBase) {
        this.numeroBase = numeroBase;
    }

    public String getMaquinaAsignada() {
        return maquinaAsignada;
    }

    public void setMaquinaAsignada(String maquinaAsignada) {
        this.maquinaAsignada = maquinaAsignada;
    }

    public Integer getRondaAsignada() {
        return rondaAsignada;
    }

    public void setRondaAsignada(Integer rondaAsignada) {
        this.rondaAsignada = rondaAsignada;
    }
}