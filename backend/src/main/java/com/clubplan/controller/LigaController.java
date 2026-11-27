package com.clubplan.controller;

import com.clubplan.entity.Liga;
import com.clubplan.entity.Partido;
import com.clubplan.entity.Usuario;
import com.clubplan.repository.EquipoRepository;
import com.clubplan.repository.LigaRepository;
import com.clubplan.repository.PartidoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ligas")
public class LigaController {

    private final LigaRepository ligaRepository;
    private final PartidoRepository partidoRepository;
    private final EquipoRepository equipoRepository;

    public LigaController(LigaRepository ligaRepository,
                           PartidoRepository partidoRepository,
                           EquipoRepository equipoRepository) {
        this.ligaRepository = ligaRepository;
        this.partidoRepository = partidoRepository;
        this.equipoRepository = equipoRepository;
    }

    @GetMapping("/equipo/{equipoId}")
    public List<Liga> ligasDeEquipo(@PathVariable Long equipoId) {
        return ligaRepository.findByEquipoId(equipoId);
    }

    @PostMapping
    public ResponseEntity<?> crearLiga(@AuthenticationPrincipal Usuario usuario,
                                        @RequestBody Map<String, String> body) {
        Long equipoId = Long.parseLong(body.get("equipoId"));
        return equipoRepository.findById(equipoId)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    Liga liga = new Liga();
                    liga.setNombre(body.get("nombre"));
                    liga.setTemporada(body.get("temporada"));
                    liga.setGrupo(body.get("grupo"));
                    liga.setEquipo(equipo);
                    ligaRepository.save(liga);
                    return ResponseEntity.ok(liga);
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarLiga(@PathVariable Long id,
                                           @AuthenticationPrincipal Usuario usuario) {
        return ligaRepository.findById(id)
                .filter(l -> l.getEquipo().getEntrenador().getId().equals(usuario.getId()))
                .map(liga -> {
                    partidoRepository.deleteAll(partidoRepository.findByLigaIdOrderByJornadaAsc(id));
                    ligaRepository.delete(liga);
                    return ResponseEntity.ok(Map.of("mensaje", "Liga eliminada"));
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @GetMapping("/{ligaId}/partidos")
    public List<Map<String, Object>> partidos(@PathVariable Long ligaId) {
        return partidoRepository.findByLigaIdOrderByJornadaAsc(ligaId).stream()
                .map(p -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", p.getId());
                    data.put("jornada", p.getJornada());
                    data.put("rival", p.getRival());
                    data.put("golesPropio", p.getGolesPropio());
                    data.put("golesRival", p.getGolesRival());
                    data.put("fecha", p.getFecha() != null ? p.getFecha().toString() : null);
                    data.put("esLocal", p.isEsLocal());
                    return data;
                })
                .toList();
    }

    @PostMapping("/{ligaId}/partidos")
    public ResponseEntity<?> addPartido(@PathVariable Long ligaId,
                                         @AuthenticationPrincipal Usuario usuario,
                                         @RequestBody Map<String, Object> body) {
        return ligaRepository.findById(ligaId)
                .filter(l -> l.getEquipo().getEntrenador().getId().equals(usuario.getId()))
                .map(liga -> {
                    Partido p = new Partido();
                    p.setLiga(liga);
                    p.setJornada(((Number) body.get("jornada")).intValue());
                    p.setRival((String) body.get("rival"));
                    p.setGolesPropio(((Number) body.get("golesPropio")).intValue());
                    p.setGolesRival(((Number) body.get("golesRival")).intValue());
                    p.setEsLocal(Boolean.TRUE.equals(body.get("esLocal")));
                    if (body.get("fecha") != null) {
                        p.setFecha(LocalDateTime.parse((String) body.get("fecha")));
                    }
                    partidoRepository.save(p);
                    return ResponseEntity.ok(p);
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @PutMapping("/partidos/{id}")
    public ResponseEntity<?> editarPartido(@PathVariable Long id,
                                            @AuthenticationPrincipal Usuario usuario,
                                            @RequestBody Map<String, Object> body) {
        return partidoRepository.findById(id)
                .filter(p -> p.getLiga().getEquipo().getEntrenador().getId().equals(usuario.getId()))
                .map(p -> {
                    p.setJornada(((Number) body.get("jornada")).intValue());
                    p.setRival((String) body.get("rival"));
                    p.setGolesPropio(((Number) body.get("golesPropio")).intValue());
                    p.setGolesRival(((Number) body.get("golesRival")).intValue());
                    p.setEsLocal(Boolean.TRUE.equals(body.get("esLocal")));
                    if (body.get("fecha") != null) {
                        p.setFecha(LocalDateTime.parse((String) body.get("fecha")));
                    }
                    partidoRepository.save(p);
                    return ResponseEntity.ok(p);
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @DeleteMapping("/partidos/{id}")
    public ResponseEntity<?> eliminarPartido(@PathVariable Long id,
                                              @AuthenticationPrincipal Usuario usuario) {
        return partidoRepository.findById(id)
                .filter(p -> p.getLiga().getEquipo().getEntrenador().getId().equals(usuario.getId()))
                .map(p -> {
                    partidoRepository.delete(p);
                    return ResponseEntity.ok(Map.of("mensaje", "Partido eliminado"));
                })
                .orElse(ResponseEntity.status(403).build());
    }

    @GetMapping("/{ligaId}/stats")
    public Map<String, Object> stats(@PathVariable Long ligaId) {
        List<Partido> partidos = partidoRepository.findByLigaIdOrderByJornadaAsc(ligaId);
        int pj = partidos.size();
        int pg = 0, pe = 0, pp = 0, gf = 0, gc = 0;
        for (Partido p : partidos) {
            gf += p.getGolesPropio();
            gc += p.getGolesRival();
            if (p.getGolesPropio() > p.getGolesRival()) pg++;
            else if (p.getGolesPropio() == p.getGolesRival()) pe++;
            else pp++;
        }
        Map<String, Object> stats = new HashMap<>();
        stats.put("pj", pj);
        stats.put("pg", pg);
        stats.put("pe", pe);
        stats.put("pp", pp);
        stats.put("gf", gf);
        stats.put("gc", gc);
        stats.put("dif", gf - gc);
        stats.put("pts", pg * 2 + pe);
        return stats;
    }
}
