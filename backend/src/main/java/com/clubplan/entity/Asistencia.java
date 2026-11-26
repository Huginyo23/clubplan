package com.clubplan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "convocatoria_id", nullable = false)
    private Convocatoria convocatoria;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.PENDIENTE;

    private LocalDateTime fechaRespuesta;

    public enum Estado {
        PENDIENTE, CONFIRMADO, RECHAZADO
    }
}
