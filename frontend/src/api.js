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

export function getPerfil() {
  return request('/auth/perfil')
}

export function editarPerfil(nombre, password, foto) {
  const body = { nombre }
  if (password) body.password = password
  if (foto !== undefined) body.foto = foto
  return request('/auth/perfil', { method: 'PUT', body: JSON.stringify(body) })
}
