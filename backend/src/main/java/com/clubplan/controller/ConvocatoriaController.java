package com.clubplan.controller;

import com.clubplan.entity.Asistencia;
import com.clubplan.entity.Convocatoria;
import com.clubplan.entity.Usuario;
import com.clubplan.repository.AsistenciaRepository;
import com.clubplan.repository.ConvocatoriaRepository;
import com.clubplan.repository.EquipoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConvocatoriaController {

    private final ConvocatoriaRepository convocatoriaRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final EquipoRepository equipoRepository;

    public ConvocatoriaController(ConvocatoriaRepository convocatoriaRepository,
                                  AsistenciaRepository asistenciaRepository,
                                  EquipoRepository equipoRepository) {
        this.convocatoriaRepository = convocatoriaRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.equipoRepository = equipoRepository;
    }

    @GetMapping("/equipos/{equipoId}/convocatorias")
    public List<Map<String, Object>> listar(@PathVariable Long equipoId) {
        return convocatoriaRepository.findByEquipoIdOrderByFechaDesc(equipoId).stream()
                .map(c -> {
                    var asistencias = asistenciaRepository.findByConvocatoriaId(c.getId());
                    long confirmados = asistencias.stream().filter(a -> a.getEstado() == Asistencia.Estado.CONFIRMADO).count();
                    long rechazados = asistencias.stream().filter(a -> a.getEstado() == Asistencia.Estado.RECHAZADO).count();
                    long pendientes = asistencias.stream().filter(a -> a.getEstado() == Asistencia.Estado.PENDIENTE).count();
                    var data = new java.util.HashMap<String, Object>();
                    data.put("id", c.getId());
                    data.put("titulo", c.getTitulo());
                    data.put("descripcion", c.getDescripcion());
                    data.put("fecha", c.getFecha().toString());
                    data.put("lugar", c.getLugar());
                    data.put("confirmados", confirmados);
                    data.put("rechazados", rechazados);
                    data.put("pendientes", pendientes);
                    data.put("total", asistencias.size());
                    return (Map<String, Object>) data;
                })
                .toList();
    }

    @PostMapping("/equipos/{equipoId}/convocatorias")
    public ResponseEntity<?> crear(@PathVariable Long equipoId,
                                   @AuthenticationPrincipal Usuario usuario,
                                   @RequestBody Map<String, String> body) {
        return equipoRepository.findById(equipoId)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    Convocatoria conv = new Convocatoria();
                    conv.setTitulo(body.get("titulo"));
                    conv.setDescripcion(body.get("descripcion"));
                    conv.setFecha(LocalDateTime.parse(body.get("fecha")));
                    conv.setLugar(body.get("lugar"));
                    conv.setEquipo(equipo);
                    conv.setCreador(usuario);
                    convocatoriaRepository.save(conv);

                    for (Usuario jugador : equipo.getJugadores()) {
                        Asistencia asistencia = new Asistencia();
                        asistencia.setConvocatoria(conv);
                        asistencia.setUsuario(jugador);
                        asistenciaRepository.save(asistencia);
                    }

                    return ResponseEntity.ok(conv);
                })
                .orElse(ResponseEntity.status(403).body(null));
    }

    @DeleteMapping("/convocatorias/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                       @AuthenticationPrincipal Usuario usuario) {
        return convocatoriaRepository.findById(id)
                .filter(c -> c.getCreador().getId().equals(usuario.getId()))
                .map(conv -> {
                    asistenciaRepository.deleteAll(asistenciaRepository.findByConvocatoriaId(conv.getId()));
                    convocatoriaRepository.delete(conv);
                    return ResponseEntity.ok(Map.of("mensaje", "Convocatoria eliminada"));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @GetMapping("/convocatorias/pendientes")
    public ResponseEntity<?> pendientes(@AuthenticationPrincipal Usuario usuario) {
        long count = asistenciaRepository.findByUsuarioId(usuario.getId()).stream()
                .filter(a -> a.getEstado() == Asistencia.Estado.PENDIENTE)
                .count();
        return ResponseEntity.ok(Map.of("pendientes", count));
    }

    @GetMapping("/convocatorias/{id}/asistencia")
    public List<Map<String, Object>> verAsistencia(@PathVariable Long id) {
        return asistenciaRepository.findByConvocatoriaId(id).stream()
                .map(a -> Map.<String, Object>of(
                        "id", a.getId(),
                        "jugador", Map.of("id", a.getUsuario().getId(), "nombre", a.getUsuario().getNombre()),
                        "estado", a.getEstado(),
                        "fechaRespuesta", a.getFechaRespuesta() != null ? a.getFechaRespuesta().toString() : ""
                ))
                .toList();
    }

    @PutMapping("/convocatorias/{id}/asistencia")
    public ResponseEntity<?> confirmar(@PathVariable Long id,
                                       @AuthenticationPrincipal Usuario usuario,
                                       @RequestBody Map<String, String> body) {
        return asistenciaRepository.findByConvocatoriaIdAndUsuarioId(id, usuario.getId())
                .map(asistencia -> {
                    asistencia.setEstado(Asistencia.Estado.valueOf(body.get("estado")));
                    asistencia.setFechaRespuesta(LocalDateTime.now());
                    asistenciaRepository.save(asistencia);
                    return ResponseEntity.ok(Map.of("mensaje", "Asistencia actualizada"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
