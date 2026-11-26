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

  return (
    <div className="container">
      <div className="flex-between">
        <div className="page-header">
          <h2>Mis equipos</h2>
          <p>{equipos.length} equipo{equipos.length !== 1 ? 's' : ''}</p>
        </div>
        {user?.rol === 'ENTRENADOR' && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : '+ Nuevo equipo'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrear} className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
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

      <div className="grid">
        {equipos.map(equipo => (
          <div key={equipo.id} className="card card-clickable" onClick={() => navigate('/equipo/' + equipo.id)}>
            <div className="card-icon card-icon-purple">&#9917;</div>
            <h3>{equipo.nombre}</h3>
            <p>Entrenador: {equipo.entrenador?.nombre || 'Tu'}</p>
          </div>
        ))}
      </div>
      {equipos.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">&#9917;</div>
          <p>No tienes equipos todavia</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
