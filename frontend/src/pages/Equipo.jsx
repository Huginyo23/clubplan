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
      <div className="page-header">
        <h2>{equipo.nombre}</h2>
        <p>Entrenador: {equipo.entrenador.nombre} — {equipo.jugadores?.length || 0} jugadores</p>
      </div>

      {esEntrenador && (
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Jugadores del equipo</h3>
          {equipo.jugadores?.map(j => (
            <div key={j.id} className="jugador-row">
              <div className="jugador-info">
                <div className="jugador-avatar">{j.nombre.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{j.nombre}</div>
                  <div style={{ color: 'var(--texto-suave)', fontSize: '0.8rem' }}>{j.email}</div>
                </div>
              </div>
            </div>
          ))}
          {(!equipo.jugadores || equipo.jugadores.length === 0) && (
            <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem', marginBottom: '12px' }}>No hay jugadores todavia</p>
          )}
          <form onSubmit={handleAddJugador} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <input
              type="email"
              placeholder="Email del jugador"
              value={emailJugador}
              onChange={e => setEmailJugador(e.target.value)}
              required
              style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--borde)', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit' }}
            />
            <button type="submit" className="btn btn-outline">Anadir</button>
          </form>
        </div>
      )}

      <div className="flex-between" style={{ marginTop: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Convocatorias</h3>
        {esEntrenador && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : '+ Nueva convocatoria'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrearConv} className="card">
          <div className="form-group">
            <label>Titulo</label>
            <input value={formConv.titulo} onChange={e => setFormConv({...formConv, titulo: e.target.value})} placeholder="Ej: Partido vs Alzira" required />
          </div>
          <div className="form-group">
            <label>Descripcion</label>
            <textarea value={formConv.descripcion} onChange={e => setFormConv({...formConv, descripcion: e.target.value})} rows="3" placeholder="Detalles de la convocatoria" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Fecha y hora</label>
              <input type="datetime-local" value={formConv.fecha} onChange={e => setFormConv({...formConv, fecha: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Lugar</label>
              <input value={formConv.lugar} onChange={e => setFormConv({...formConv, lugar: e.target.value})} placeholder="Ej: Campo Municipal" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Crear convocatoria</button>
        </form>
      )}

      {convocatorias.map(c => (
        <div key={c.id} className="card card-clickable" onClick={() => navigate('/convocatoria/' + c.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{c.titulo}</h3>
              <p>{c.lugar} — {new Date(c.fecha).toLocaleString('es-ES')}</p>
            </div>
            <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>&#8250;</span>
          </div>
        </div>
      ))}
      {convocatorias.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">&#128197;</div>
          <p>No hay convocatorias todavia</p>
        </div>
      )}
    </div>
  )
}

export default Equipo
