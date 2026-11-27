import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEquipos, crearEquipo, eliminarEquipo, getUser } from '../api'

const DEPORTES = {
  futbol: { nombre: 'Fútbol', emoji: '⚽' },
  baloncesto: { nombre: 'Baloncesto', emoji: '🏀' },
  tenis: { nombre: 'Tenis', emoji: '🎾' },
  voleibol: { nombre: 'Voleibol', emoji: '🏐' },
  beisbol: { nombre: 'Béisbol', emoji: '⚾' },
  rugby: { nombre: 'Rugby', emoji: '🏈' },
  balonmano: { nombre: 'Balonmano', emoji: '🤾' },
  hockey: { nombre: 'Hockey', emoji: '🏒' },
  otro: { nombre: 'Otro', emoji: '🏆' },
}

function Dashboard() {
  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState('')
  const [deporte, setDeporte] = useState('futbol')
  const [creando, setCreando] = useState(false)
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    getEquipos().then(setEquipos)
  }, [])

  async function handleCrear(e) {
    e.preventDefault()
    await crearEquipo(nombre, deporte)
    setNombre('')
    setDeporte('futbol')
    setCreando(false)
    getEquipos().then(setEquipos)
  }

  async function handleEliminar(e, id) {
    e.stopPropagation()
    if (!confirm('¿Estás seguro de que quieres eliminar este equipo?')) return
    await eliminarEquipo(id)
    getEquipos().then(setEquipos)
  }

  const hora = new Date().getHours()
  const saludo = hora < 14 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="container">
      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: 'var(--texto-suave)', fontSize: '0.88rem', marginBottom: '2px' }}>{saludo}</p>
        <h2 style={{ fontSize: '1.7rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          {user?.nombre || 'Usuario'}
        </h2>
      </div>

      <div className="stat-cards" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--primary)' }}>{equipos.length}</div>
          <p>{equipos.length === 1 ? 'Equipo' : 'Equipos'}</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--accent)' }}>
            {equipos.reduce((acc, e) => acc + (e.jugadores?.length || 0), 0)}
          </div>
          <p>Jugadores</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--amarillo)' }}>
            {user?.rol === 'ENTRENADOR' ? 'ENT' : 'JUG'}
          </div>
          <p>Tu rol</p>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={() => navigate('/calendario')} style={{ padding: '10px 20px' }}>
          &#128197; Ver calendario
        </button>
      </div>

      <div className="flex-between">
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Mis equipos</h3>
        {user?.rol === 'ENTRENADOR' && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)} style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
            {creando ? 'Cancelar' : '+ Nuevo equipo'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrear} className="card" style={{ marginTop: '12px', animation: 'fadeUp 0.2s ease' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.82rem' }}>Nombre del equipo</label>
              <input
                placeholder="Ej: Juvenil A"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--borde)', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', background: 'var(--blanco)', color: 'var(--texto)' }}
              />
            </div>
            <div style={{ width: '170px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.82rem' }}>Deporte</label>
              <select
                value={deporte}
                onChange={e => setDeporte(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--borde)', borderRadius: '10px', fontSize: '0.92rem', fontFamily: 'inherit', background: 'var(--blanco)', color: 'var(--texto)' }}
              >
                {Object.entries(DEPORTES).map(([key, d]) => (
                  <option key={key} value={key}>{d.emoji} {d.nombre}</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Crear equipo</button>
        </form>
      )}

      <div className="grid" style={{ marginTop: '14px' }}>
        {equipos.map(equipo => (
          <div key={equipo.id} className="card card-clickable" onClick={() => navigate('/equipo/' + equipo.id)} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div className="card-icon card-icon-purple" style={{ fontSize: '1.4rem', flexShrink: 0 }}>
                {DEPORTES[equipo.deporte]?.emoji || DEPORTES.futbol.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '1.05rem' }}>{equipo.nombre}</h3>
                <p style={{ fontSize: '0.82rem' }}>{DEPORTES[equipo.deporte]?.nombre || 'Fútbol'} &middot; {equipo.jugadores?.length || 0} jugadores</p>
              </div>
            </div>
            {user?.rol === 'ENTRENADOR' && equipo.entrenador?.id === user?.id && (
              <button
                className="btn btn-danger"
                style={{ position: 'absolute', top: '12px', right: '12px', padding: '5px 10px', fontSize: '0.72rem' }}
                onClick={e => handleEliminar(e, equipo.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
      {equipos.length === 0 && !creando && (
        <div className="empty-state">
          <div className="empty-icon">&#9917;</div>
          <p>No tienes equipos todavía</p>
          {user?.rol === 'ENTRENADOR' && (
            <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => setCreando(true)}>
              Crear mi primer equipo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard
