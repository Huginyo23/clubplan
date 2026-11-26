package com.clubplan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "entrenador_id", nullable = false)
    private Usuario entrenador;

    @ManyToMany
    @JoinTable(
        name = "equipo_jugador",
        joinColumns = @JoinColumn(name = "equipo_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    @JsonIgnore
    private Set<Usuario> jugadores = new HashSet<>();
}
