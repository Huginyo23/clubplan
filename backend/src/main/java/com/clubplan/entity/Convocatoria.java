package com.clubplan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
public class Convocatoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fecha;

    private String lugar;

    @ManyToOne
    @JoinColumn(name = "equipo_id", nullable = false)
    private Equipo equipo;

    @ManyToOne
    @JoinColumn(name = "creador_id", nullable = false)
    private Usuario creador;
}
