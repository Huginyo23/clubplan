package com.clubplan.config;

import com.clubplan.entity.Usuario;
import com.clubplan.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInit implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInit(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!usuarioRepository.existsByEmail("admin@clubplan.com")) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setEmail("admin@clubplan.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ENTRENADOR);
            usuarioRepository.save(admin);
        }
    }
}
