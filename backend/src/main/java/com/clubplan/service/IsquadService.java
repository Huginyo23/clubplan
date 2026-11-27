package com.clubplan.service;

import com.clubplan.entity.ClasificacionEquipo;
import com.clubplan.entity.Liga;
import com.clubplan.repository.ClasificacionEquipoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class IsquadService {

    private static final String API_URL = "https://resultadosbalonmano.isquad.es/maqueta/json/beta.php";
    private final ClasificacionEquipoRepository clasificacionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public IsquadService(ClasificacionEquipoRepository clasificacionRepository) {
        this.clasificacionRepository = clasificacionRepository;
    }

    public void sincronizar(Liga liga) {
        Long torneoId = liga.getIsquadTorneoId();
        if (torneoId == null) return;

        Map<Long, String> nombres = obtenerNombresEquipos(torneoId);
        List<ClasificacionEquipo> filas = obtenerClasificacion(torneoId, liga, nombres);

        clasificacionRepository.deleteAll(
                clasificacionRepository.findByLigaIdOrderByPosicionAsc(liga.getId()));
        clasificacionRepository.saveAll(filas);
    }

    private Map<Long, String> obtenerNombresEquipos(Long torneoId) {
        Map<Long, String> nombres = new HashMap<>();
        try {
            String body = post(Map.of("tipo", "torneo", "id", torneoId.toString()));
            JsonNode root = objectMapper.readTree(body);
            JsonNode partidos = root.get("partidos");
            if (partidos != null && partidos.isArray()) {
                for (JsonNode p : partidos) {
                    JsonNode l = p.get("l");
                    JsonNode v = p.get("v");
                    if (l != null) nombres.put(l.get("id").asLong(), l.get("n").asText());
                    if (v != null) nombres.put(v.get("id").asLong(), v.get("n").asText());
                }
            }
        } catch (Exception ignored) {}
        return nombres;
    }

    private List<ClasificacionEquipo> obtenerClasificacion(Long torneoId, Liga liga, Map<Long, String> nombres) {
        List<ClasificacionEquipo> resultado = new ArrayList<>();
        try {
            String body = post(Map.of("tipo", "clasificacion", "se", "0", "id", torneoId.toString(), "j", "0"));
            JsonNode root = objectMapper.readTree(body);
            JsonNode filas = root.get("filas");
            if (filas != null && filas.isArray()) {
                for (JsonNode fila : filas) {
                    ClasificacionEquipo c = new ClasificacionEquipo();
                    c.setLiga(liga);
                    long eqId = fila.get("id_equipo").asLong();
                    c.setNombre(nombres.getOrDefault(eqId, "Equipo " + eqId));
                    c.setPosicion(fila.get("posicion").asInt());
                    c.setPj(fila.get("jugados").asInt());
                    c.setPg(fila.get("ganados").asInt());
                    c.setPe(fila.get("empatados").asInt());
                    c.setPp(fila.get("perdidos").asInt());
                    c.setGf(fila.get("goles_a_favor").asInt());
                    c.setGc(fila.get("goles_en_contra").asInt());
                    c.setPts(fila.get("puntos").asInt());
                    c.setEsPropio(false);
                    resultado.add(c);
                }
            }
        } catch (Exception ignored) {}
        return resultado;
    }

    private String post(Map<String, String> params) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        params.forEach(form::add);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, request, String.class);
        return response.getBody();
    }
}
