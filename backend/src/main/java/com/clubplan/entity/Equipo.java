package com.clubplan.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@Entity
@EqualsAndHashCode(exclude = "jugadores")
@ToString(exclude = "jugadores")
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String deporte;

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

    private Long capitanId;
}
