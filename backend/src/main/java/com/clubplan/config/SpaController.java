package com.clubplan.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {"/", "/login", "/register", "/equipo/{id}", "/convocatoria/{id}"})
    public String forward() {
        return "forward:/index.html";
    }
}
