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
        <h2>Mis equipos</h2>
        {user?.rol === 'ENTRENADOR' && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : 'Nuevo equipo'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrear} className="card" style={{ display: 'flex', gap: '12px' }}>
          <input
            className="form-group"
            placeholder="Nombre del equipo"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            style={{ flex: 1, padding: '10px', border: '1px solid var(--borde)', borderRadius: '6px' }}
          />
          <button type="submit" className="btn btn-primary">Crear</button>
        </form>
      )}

      <div className="grid">
        {equipos.map(equipo => (
          <div key={equipo.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/equipo/' + equipo.id)}>
            <h3>{equipo.nombre}</h3>
            <p>Entrenador: {equipo.entrenador?.nombre || 'Tu'}</p>
          </div>
        ))}
        {equipos.length === 0 && <p style={{ color: 'var(--texto-suave)' }}>No tienes equipos todavia</p>}
      </div>
    </div>
  )
}

export default Dashboard
