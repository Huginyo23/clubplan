package com.clubplan.repository;

import com.clubplan.entity.Partido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartidoRepository extends JpaRepository<Partido, Long> {
    List<Partido> findByLigaIdOrderByJornadaAsc(Long ligaId);
}
