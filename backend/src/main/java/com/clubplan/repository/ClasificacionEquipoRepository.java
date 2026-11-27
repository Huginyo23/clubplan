package com.clubplan.repository;

import com.clubplan.entity.ClasificacionEquipo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClasificacionEquipoRepository extends JpaRepository<ClasificacionEquipo, Long> {
    List<ClasificacionEquipo> findByLigaIdOrderByPosicionAsc(Long ligaId);
}
