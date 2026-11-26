package com.clubplan.controller;

import com.clubplan.entity.Usuario;
import com.clubplan.repository.UsuarioRepository;
import com.clubplan.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder,
                          JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (usuarioRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email ya existe"));
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(body.get("nombre"));
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(body.get("password")));
        usuario.setRol(Usuario.Rol.valueOf(body.getOrDefault("rol", "JUGADOR")));

        usuarioRepository.save(usuario);
        String token = jwtService.generateToken(usuario.getId(), usuario.getEmail());

        return ResponseEntity.ok(Map.of("token", token, "usuario", Map.of(
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol()
        )));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return usuarioRepository.findByEmail(body.get("email"))
                .filter(u -> passwordEncoder.matches(body.get("password"), u.getPassword()))
                .map(u -> {
                    String token = jwtService.generateToken(u.getId(), u.getEmail());
                    return ResponseEntity.ok(Map.of("token", token, "usuario", Map.of(
                            "id", u.getId(),
                            "nombre", u.getNombre(),
                            "email", u.getEmail(),
                            "rol", u.getRol()
                    )));
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas")));
    }
}
