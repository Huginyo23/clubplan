import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEquipo, addJugador, getConvocatorias, crearConvocatoria, getUser } from '../api'

function Equipo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [equipo, setEquipo] = useState(null)
  const [convocatorias, setConvocatorias] = useState([])
  const [emailJugador, setEmailJugador] = useState('')
  const [formConv, setFormConv] = useState({ titulo: '', descripcion: '', fecha: '', lugar: '' })
  const [creando, setCreando] = useState(false)

  useEffect(() => {
    getEquipo(id).then(setEquipo)
    getConvocatorias(id).then(setConvocatorias)
  }, [id])

  const esEntrenador = equipo?.entrenador?.id === user?.id

  async function handleAddJugador(e) {
    e.preventDefault()
    await addJugador(id, emailJugador)
    setEmailJugador('')
    getEquipo(id).then(setEquipo)
  }

  async function handleCrearConv(e) {
    e.preventDefault()
    await crearConvocatoria(id, formConv)
    setFormConv({ titulo: '', descripcion: '', fecha: '', lugar: '' })
    setCreando(false)
    getConvocatorias(id).then(setConvocatorias)
  }

  if (!equipo) return <div className="container"><p>Cargando...</p></div>

  return (
    <div className="container">
      <h2>{equipo.nombre}</h2>
      <p style={{ color: 'var(--texto-suave)', marginBottom: '24px' }}>
        Entrenador: {equipo.entrenador.nombre} — {equipo.jugadores?.length || 0} jugadores
      </p>

      {esEntrenador && (
        <div className="card">
          <h3>Jugadores</h3>
          {equipo.jugadores?.map(j => (
            <p key={j.id}>{j.nombre} ({j.email})</p>
          ))}
          <form onSubmit={handleAddJugador} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <input
              type="email"
              placeholder="Email del jugador"
              value={emailJugador}
              onChange={e => setEmailJugador(e.target.value)}
              required
              style={{ flex: 1, padding: '8px', border: '1px solid var(--borde)', borderRadius: '6px' }}
            />
            <button type="submit" className="btn btn-outline">Añadir</button>
          </form>
        </div>
      )}

      <div className="flex-between" style={{ marginTop: '24px' }}>
        <h3>Convocatorias</h3>
        {esEntrenador && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : 'Nueva convocatoria'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrearConv} className="card">
          <div className="form-group">
            <label>Titulo</label>
            <input value={formConv.titulo} onChange={e => setFormConv({...formConv, titulo: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Descripcion</label>
            <textarea value={formConv.descripcion} onChange={e => setFormConv({...formConv, descripcion: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Fecha y hora</label>
            <input type="datetime-local" value={formConv.fecha} onChange={e => setFormConv({...formConv, fecha: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Lugar</label>
            <input value={formConv.lugar} onChange={e => setFormConv({...formConv, lugar: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Crear convocatoria</button>
        </form>
      )}

      {convocatorias.map(c => (
        <div key={c.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/convocatoria/' + c.id)}>
          <h3>{c.titulo}</h3>
          <p>{c.lugar} — {new Date(c.fecha).toLocaleString('es-ES')}</p>
        </div>
      ))}
    </div>
  )
}

export default Equipo
