package com.clubplan.controller;

import com.clubplan.entity.Equipo;
import com.clubplan.entity.Mensaje;
import com.clubplan.entity.Usuario;
import com.clubplan.repository.AsistenciaRepository;
import com.clubplan.repository.ConvocatoriaRepository;
import com.clubplan.repository.EquipoRepository;
import com.clubplan.repository.MensajeRepository;
import com.clubplan.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConvocatoriaRepository convocatoriaRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final MensajeRepository mensajeRepository;

    public EquipoController(EquipoRepository equipoRepository,
                            UsuarioRepository usuarioRepository,
                            ConvocatoriaRepository convocatoriaRepository,
                            AsistenciaRepository asistenciaRepository,
                            MensajeRepository mensajeRepository) {
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
        this.convocatoriaRepository = convocatoriaRepository;
        this.asistenciaRepository = asistenciaRepository;
        this.mensajeRepository = mensajeRepository;
    }

    @GetMapping
    public List<Equipo> misEquipos(@AuthenticationPrincipal Usuario usuario) {
        List<Equipo> comoEntrenador = equipoRepository.findByEntrenadorId(usuario.getId());
        List<Equipo> comoJugador = equipoRepository.findByJugadorId(usuario.getId());
        return Stream.concat(comoEntrenador.stream(), comoJugador.stream()).distinct().toList();
    }

    @PostMapping
    public ResponseEntity<?> crear(@AuthenticationPrincipal Usuario usuario,
                                   @RequestBody Map<String, String> body) {
        if (usuario.getRol() != Usuario.Rol.ENTRENADOR) {
            return ResponseEntity.status(403).body(Map.of("error", "Solo los entrenadores pueden crear equipos"));
        }

        Equipo equipo = new Equipo();
        equipo.setNombre(body.get("nombre"));
        equipo.setDeporte(body.getOrDefault("deporte", "futbol"));
        equipo.setEntrenador(usuario);
        equipoRepository.save(equipo);
        return ResponseEntity.ok(equipo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @AuthenticationPrincipal Usuario usuario) {
        return equipoRepository.findById(id)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    var convocatorias = convocatoriaRepository.findByEquipoIdOrderByFechaDesc(equipo.getId());
                    for (var conv : convocatorias) {
                        asistenciaRepository.deleteAll(asistenciaRepository.findByConvocatoriaId(conv.getId()));
                    }
                    convocatoriaRepository.deleteAll(convocatorias);
                    equipo.getJugadores().clear();
                    equipoRepository.save(equipo);
                    equipoRepository.delete(equipo);
                    return ResponseEntity.ok(Map.of("mensaje", "Equipo eliminado"));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id,
                                     @AuthenticationPrincipal Usuario usuario,
                                     @RequestBody Map<String, String> body) {
        return equipoRepository.findById(id)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    if (body.containsKey("nombre")) equipo.setNombre(body.get("nombre"));
                    if (body.containsKey("deporte")) equipo.setDeporte(body.get("deporte"));
                    equipoRepository.save(equipo);
                    return ResponseEntity.ok(Map.of("mensaje", "Equipo actualizado"));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Long id) {
        return equipoRepository.findById(id)
                .map(equipo -> {
                    var data = new java.util.HashMap<String, Object>();
                    data.put("id", equipo.getId());
                    data.put("nombre", equipo.getNombre());
                    data.put("deporte", equipo.getDeporte());
                    data.put("entrenador", Map.of("id", equipo.getEntrenador().getId(), "nombre", equipo.getEntrenador().getNombre()));
                    data.put("jugadores", equipo.getJugadores().stream().map(j -> Map.of("id", j.getId(), "nombre", j.getNombre(), "email", j.getEmail())).toList());
                    data.put("capitanId", equipo.getCapitanId());
                    return ResponseEntity.ok(data);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/jugadores")
    public ResponseEntity<?> addJugador(@PathVariable Long id,
                                        @AuthenticationPrincipal Usuario usuario,
                                        @RequestBody Map<String, String> body) {
        return equipoRepository.findById(id)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    return usuarioRepository.findByEmail(body.get("email"))
                            .map(jugador -> {
                                equipo.getJugadores().add(jugador);
                                equipoRepository.save(equipo);
                                return ResponseEntity.ok(Map.of("mensaje", "Jugador añadido"));
                            })
                            .orElse(ResponseEntity.badRequest().body(Map.of("error", "Usuario no encontrado")));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @GetMapping("/{id}/estadisticas")
    public ResponseEntity<?> estadisticas(@PathVariable Long id) {
        return equipoRepository.findById(id)
                .map(equipo -> {
                    var convocatorias = convocatoriaRepository.findByEquipoIdOrderByFechaDesc(equipo.getId());
                    int totalConv = convocatorias.size();
                    List<Map<String, Object>> jugadores = new ArrayList<>();
                    for (var jugador : equipo.getJugadores()) {
                        long confirmados = 0;
                        long rechazados = 0;
                        long pendientes = 0;
                        for (var conv : convocatorias) {
                            var asistencias = asistenciaRepository.findByConvocatoriaId(conv.getId());
                            for (var a : asistencias) {
                                if (a.getUsuario().getId().equals(jugador.getId())) {
                                    switch (a.getEstado()) {
                                        case CONFIRMADO -> confirmados++;
                                        case RECHAZADO -> rechazados++;
                                        default -> pendientes++;
                                    }
                                }
                            }
                        }
                        Map<String, Object> stats = new HashMap<>();
                        stats.put("id", jugador.getId());
                        stats.put("nombre", jugador.getNombre());
                        stats.put("confirmados", confirmados);
                        stats.put("rechazados", rechazados);
                        stats.put("pendientes", pendientes);
                        stats.put("porcentaje", totalConv > 0 ? Math.round(confirmados * 100.0 / totalConv) : 0);
                        jugadores.add(stats);
                    }
                    return ResponseEntity.ok(Map.of("totalConvocatorias", totalConv, "jugadores", jugadores));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/jugadores/{jugadorId}")
    public ResponseEntity<?> removeJugador(@PathVariable Long id,
                                            @PathVariable Long jugadorId,
                                            @AuthenticationPrincipal Usuario usuario) {
        return equipoRepository.findById(id)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    equipo.getJugadores().removeIf(j -> j.getId().equals(jugadorId));
                    equipoRepository.save(equipo);
                    return ResponseEntity.ok(Map.of("mensaje", "Jugador eliminado del equipo"));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @PutMapping("/{id}/capitan")
    public ResponseEntity<?> setCapitan(@PathVariable Long id,
                                         @AuthenticationPrincipal Usuario usuario,
                                         @RequestBody Map<String, Long> body) {
        return equipoRepository.findById(id)
                .filter(e -> e.getEntrenador().getId().equals(usuario.getId()))
                .map(equipo -> {
                    equipo.setCapitanId(body.get("capitanId"));
                    equipoRepository.save(equipo);
                    return ResponseEntity.ok(Map.of("mensaje", "Capitán asignado"));
                })
                .orElse(ResponseEntity.status(403).body(Map.of("error", "No tienes permiso")));
    }

    @GetMapping("/{id}/mensajes")
    public List<Map<String, Object>> getMensajes(@PathVariable Long id) {
        return mensajeRepository.findByEquipoIdOrderByFechaAsc(id).stream()
                .map(m -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", m.getId());
                    data.put("texto", m.getTexto());
                    data.put("fecha", m.getFecha().toString());
                    data.put("usuario", Map.of("id", m.getUsuario().getId(), "nombre", m.getUsuario().getNombre()));
                    return data;
                })
                .toList();
    }

    @PostMapping("/{id}/mensajes")
    public ResponseEntity<?> enviarMensaje(@PathVariable Long id,
                                            @AuthenticationPrincipal Usuario usuario,
                                            @RequestBody Map<String, String> body) {
        return equipoRepository.findById(id)
                .map(equipo -> {
                    Mensaje mensaje = new Mensaje();
                    mensaje.setEquipo(equipo);
                    mensaje.setUsuario(usuario);
                    mensaje.setTexto(body.get("texto"));
                    mensaje.setFecha(LocalDateTime.now());
                    mensajeRepository.save(mensaje);
                    return ResponseEntity.ok(Map.of("mensaje", "Mensaje enviado"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
