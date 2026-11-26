# ClubPlan

App para gestionar convocatorias y asistencia para equipos deportivos.

## Tecnologias

- **Backend:** Spring Boot 3 + Spring Security + JWT + MySQL
- **Frontend:** React 18 + Vite + React Router

## Como arrancar

### Base de datos

Crear la base de datos MySQL:

```sql
CREATE DATABASE clubplan;
```

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Arranca en `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Arranca en `http://localhost:5173`

## Endpoints API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | /api/auth/register | Registro |
| POST | /api/auth/login | Login |
| GET | /api/equipos | Mis equipos |
| POST | /api/equipos | Crear equipo |
| GET | /api/equipos/:id | Detalle equipo |
| POST | /api/equipos/:id/jugadores | Añadir jugador |
| GET | /api/equipos/:id/convocatorias | Listar convocatorias |
| POST | /api/equipos/:id/convocatorias | Crear convocatoria |
| GET | /api/convocatorias/:id/asistencia | Ver asistencia |
| PUT | /api/convocatorias/:id/asistencia | Confirmar/rechazar |
