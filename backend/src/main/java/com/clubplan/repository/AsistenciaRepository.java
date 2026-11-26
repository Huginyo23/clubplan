package com.clubplan.repository;

import com.clubplan.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByConvocatoriaId(Long convocatoriaId);
    Optional<Asistencia> findByConvocatoriaIdAndUsuarioId(Long convocatoriaId, Long usuarioId);
}
