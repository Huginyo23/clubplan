package com.clubplan.repository;

import com.clubplan.entity.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface EquipoRepository extends JpaRepository<Equipo, Long> {
    List<Equipo> findByEntrenadorId(Long entrenadorId);

    @Query("SELECT e FROM Equipo e JOIN e.jugadores j WHERE j.id = :userId")
    List<Equipo> findByJugadorId(Long userId);
}
