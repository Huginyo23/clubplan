package com.clubplan.repository;

import com.clubplan.entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeRepository extends JpaRepository<Mensaje, Long> {
    List<Mensaje> findByEquipoIdOrderByFechaAsc(Long equipoId);
}
