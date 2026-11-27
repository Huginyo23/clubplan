const API = '/api'

function getToken() {
  return localStorage.getItem('token')
}

export function setToken(token) {
  localStorage.setItem('token', token)
}

export function removeToken() {
  localStorage.removeItem('token')
}

export function getUser() {
  const data = localStorage.getItem('usuario')
  return data ? JSON.parse(data) : null
}

export function setUser(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario))
}

async function request(url, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(API + url, { ...options, headers })
  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    return
  }
  return res.json()
}

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export function register(nombre, email, password, rol) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ nombre, email, password, rol }) })
}

export function getEquipos() {
  return request('/equipos')
}

export function crearEquipo(nombre, deporte) {
  return request('/equipos', { method: 'POST', body: JSON.stringify({ nombre, deporte }) })
}

export function eliminarEquipo(id) {
  return request('/equipos/' + id, { method: 'DELETE' })
}

export function getEquipo(id) {
  return request('/equipos/' + id)
}

export function editarEquipo(id, nombre, deporte) {
  return request('/equipos/' + id, { method: 'PUT', body: JSON.stringify({ nombre, deporte }) })
}

export function addJugador(equipoId, email) {
  return request('/equipos/' + equipoId + '/jugadores', { method: 'POST', body: JSON.stringify({ email }) })
}

export function removeJugador(equipoId, jugadorId) {
  return request('/equipos/' + equipoId + '/jugadores/' + jugadorId, { method: 'DELETE' })
}

export function getConvocatorias(equipoId) {
  return request('/equipos/' + equipoId + '/convocatorias')
}

export function crearConvocatoria(equipoId, data) {
  return request('/equipos/' + equipoId + '/convocatorias', { method: 'POST', body: JSON.stringify(data) })
}

export function getAsistencia(convocatoriaId) {
  return request('/convocatorias/' + convocatoriaId + '/asistencia')
}

export function confirmarAsistencia(convocatoriaId, estado) {
  return request('/convocatorias/' + convocatoriaId + '/asistencia', { method: 'PUT', body: JSON.stringify({ estado }) })
}

export function eliminarConvocatoria(id) {
  return request('/convocatorias/' + id, { method: 'DELETE' })
}

export function getEstadisticas(equipoId) {
  return request('/equipos/' + equipoId + '/estadisticas')
}

export function getPendientes() {
  return request('/convocatorias/pendientes')
}

export function getMensajes(equipoId) {
  return request('/equipos/' + equipoId + '/mensajes')
}

export function enviarMensaje(equipoId, texto) {
  return request('/equipos/' + equipoId + '/mensajes', { method: 'POST', body: JSON.stringify({ texto }) })
}

export function setCapitan(equipoId, capitanId) {
  return request('/equipos/' + equipoId + '/capitan', { method: 'PUT', body: JSON.stringify({ capitanId }) })
}

export function setResultado(convId, resultado) {
  return request('/convocatorias/' + convId + '/resultado', { method: 'PUT', body: JSON.stringify({ resultado }) })
}

export function getConvocatoriaInfo(id) {
  return request('/convocatorias/' + id + '/info')
}

export function getTodasConvocatorias() {
  return request('/convocatorias/todas')
}

export function getPerfil() {
  return request('/auth/perfil')
}

export function editarPerfil(nombre, password, foto) {
  const body = { nombre }
  if (password) body.password = password
  if (foto !== undefined) body.foto = foto
  return request('/auth/perfil', { method: 'PUT', body: JSON.stringify(body) })
}

export function getLigas(equipoId) {
  return request('/ligas/equipo/' + equipoId)
}

export function crearLiga(equipoId, nombre, temporada, grupo) {
  return request('/ligas', { method: 'POST', body: JSON.stringify({ equipoId, nombre, temporada, grupo }) })
}

export function eliminarLiga(id) {
  return request('/ligas/' + id, { method: 'DELETE' })
}

export function getPartidos(ligaId) {
  return request('/ligas/' + ligaId + '/partidos')
}

export function addPartido(ligaId, data) {
  return request('/ligas/' + ligaId + '/partidos', { method: 'POST', body: JSON.stringify(data) })
}

export function editarPartido(id, data) {
  return request('/ligas/partidos/' + id, { method: 'PUT', body: JSON.stringify(data) })
}

export function eliminarPartido(id) {
  return request('/ligas/partidos/' + id, { method: 'DELETE' })
}

export function getLigaStats(ligaId) {
  return request('/ligas/' + ligaId + '/stats')
}
