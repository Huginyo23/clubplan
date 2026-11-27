package com.clubplan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
public class Partido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int jornada;

    @Column(nullable = false)
    private String rival;

    private int golesPropio;

    private int golesRival;

    private LocalDateTime fecha;

    private boolean esLocal;

    @ManyToOne
    @JoinColumn(name = "liga_id", nullable = false)
    private Liga liga;
}
