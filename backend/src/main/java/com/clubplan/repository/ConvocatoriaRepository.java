package com.clubplan.repository;

import com.clubplan.entity.Convocatoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ConvocatoriaRepository extends JpaRepository<Convocatoria, Long> {
    List<Convocatoria> findByEquipoIdOrderByFechaDesc(Long equipoId);
}
