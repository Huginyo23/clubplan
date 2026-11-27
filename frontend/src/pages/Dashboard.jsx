import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEquipos, crearEquipo, getUser } from '../api'

function Dashboard() {
  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState('')
  const [creando, setCreando] = useState(false)
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    getEquipos().then(setEquipos)
  }, [])

  async function handleCrear(e) {
    e.preventDefault()
    await crearEquipo(nombre)
    setNombre('')
    setCreando(false)
    getEquipos().then(setEquipos)
  }

  const hora = new Date().getHours()
  const saludo = hora < 14 ? 'Buenos días' : hora < 21 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="container">
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
          {saludo}, {user?.nombre || 'Usuario'}
        </h2>
        <p style={{ color: 'var(--texto-suave)', marginTop: '4px' }}>
          {user?.rol === 'ENTRENADOR' ? 'Panel de entrenador' : 'Panel de jugador'}
        </p>
      </div>

      <div className="stat-cards" style={{ marginBottom: '28px' }}>
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

      <div className="flex-between">
        <div className="page-header" style={{ marginBottom: '0' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Mis equipos</h2>
        </div>
        {user?.rol === 'ENTRENADOR' && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : '+ Nuevo equipo'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrear} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginTop: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem' }}>Nombre del equipo</label>
            <input
              placeholder="Ej: Juvenil A"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', border: '2px solid var(--borde)', borderRadius: '10px', fontSize: '0.95rem', fontFamily: 'inherit' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '46px' }}>Crear</button>
        </form>
      )}

      <div className="grid" style={{ marginTop: '16px' }}>
        {equipos.map(equipo => (
          <div key={equipo.id} className="card card-clickable" onClick={() => navigate('/equipo/' + equipo.id)}>
            <div className="card-icon card-icon-purple">&#9917;</div>
            <h3>{equipo.nombre}</h3>
            <p>Entrenador: {equipo.entrenador?.nombre || 'Tú'}</p>
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
