package com.clubplan.controller;

import com.clubplan.entity.Equipo;
import com.clubplan.entity.Usuario;
import com.clubplan.repository.EquipoRepository;
import com.clubplan.repository.UsuarioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final EquipoRepository equipoRepository;
    private final UsuarioRepository usuarioRepository;

    public EquipoController(EquipoRepository equipoRepository,
                            UsuarioRepository usuarioRepository) {
        this.equipoRepository = equipoRepository;
        this.usuarioRepository = usuarioRepository;
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
        equipo.setEntrenador(usuario);
        equipoRepository.save(equipo);
        return ResponseEntity.ok(equipo);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Long id) {
        return equipoRepository.findById(id)
                .map(equipo -> ResponseEntity.ok(Map.of(
                        "id", equipo.getId(),
                        "nombre", equipo.getNombre(),
                        "entrenador", Map.of("id", equipo.getEntrenador().getId(), "nombre", equipo.getEntrenador().getNombre()),
                        "jugadores", equipo.getJugadores().stream().map(j -> Map.of("id", j.getId(), "nombre", j.getNombre(), "email", j.getEmail())).toList()
                )))
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
}
