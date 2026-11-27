import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEquipo, addJugador, removeJugador, editarEquipo, getConvocatorias, crearConvocatoria, eliminarConvocatoria, getUser } from '../api'

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

function Equipo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [equipo, setEquipo] = useState(null)
  const [convocatorias, setConvocatorias] = useState([])
  const [emailJugador, setEmailJugador] = useState('')
  const [formConv, setFormConv] = useState({ titulo: '', descripcion: '', fecha: '', lugar: '' })
  const [creando, setCreando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [editNombre, setEditNombre] = useState('')
  const [editDeporte, setEditDeporte] = useState('')

  useEffect(() => {
    getEquipo(id).then(setEquipo)
    getConvocatorias(id).then(setConvocatorias)
  }, [id])

  const esEntrenador = equipo?.entrenador?.id === user?.id
  const dep = DEPORTES[equipo?.deporte] || DEPORTES.futbol

  async function handleAddJugador(e) {
    e.preventDefault()
    await addJugador(id, emailJugador)
    setEmailJugador('')
    getEquipo(id).then(setEquipo)
  }

  async function handleRemoveJugador(jugadorId) {
    if (!confirm('¿Eliminar este jugador del equipo?')) return
    await removeJugador(id, jugadorId)
    getEquipo(id).then(setEquipo)
  }

  async function handleEditar(e) {
    e.preventDefault()
    await editarEquipo(id, editNombre, editDeporte)
    setEditando(false)
    getEquipo(id).then(setEquipo)
  }

  function abrirEditar() {
    setEditNombre(equipo.nombre)
    setEditDeporte(equipo.deporte || 'futbol')
    setEditando(true)
  }

  async function handleCrearConv(e) {
    e.preventDefault()
    await crearConvocatoria(id, formConv)
    setFormConv({ titulo: '', descripcion: '', fecha: '', lugar: '' })
    setCreando(false)
    getConvocatorias(id).then(setConvocatorias)
  }

  async function handleEliminarConv(e, convId) {
    e.stopPropagation()
    if (!confirm('¿Eliminar esta convocatoria?')) return
    await eliminarConvocatoria(convId)
    getConvocatorias(id).then(setConvocatorias)
  }

  function formatFecha(fecha) {
    const d = new Date(fecha)
    const dia = d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
    const hora = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    return { dia, hora }
  }

  if (!equipo) return <div className="container"><p>Cargando...</p></div>

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
        &larr; Volver
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '2.5rem' }}>{dep.emoji}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{equipo.nombre}</h2>
            <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>
              {dep.nombre} &middot; Entrenador: {equipo.entrenador.nombre} &middot; {equipo.jugadores?.length || 0} jugadores
            </p>
          </div>
          {esEntrenador && (
            <button onClick={abrirEditar} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
              Editar
            </button>
          )}
        </div>

        {editando && (
          <form onSubmit={handleEditar} style={{ marginTop: '16px', borderTop: '1px solid var(--borde)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem' }}>Nombre</label>
                <input value={editNombre} onChange={e => setEditNombre(e.target.value)} required
                  style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--borde)', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit' }} />
              </div>
              <div style={{ width: '180px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.85rem' }}>Deporte</label>
                <select value={editDeporte} onChange={e => setEditDeporte(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '2px solid var(--borde)', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                  {Object.entries(DEPORTES).map(([key, d]) => (
                    <option key={key} value={key}>{d.emoji} {d.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Guardar</button>
              <button type="button" className="btn btn-outline" onClick={() => setEditando(false)} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {esEntrenador && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>Jugadores</h3>
          {equipo.jugadores?.map(j => (
            <div key={j.id} className="jugador-row">
              <div className="jugador-info">
                <div className="jugador-avatar">{j.nombre.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{j.nombre}</div>
                  <div style={{ color: 'var(--texto-suave)', fontSize: '0.8rem' }}>{j.email}</div>
                </div>
              </div>
              <button onClick={() => handleRemoveJugador(j.id)} className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                Quitar
              </button>
            </div>
          ))}
          {(!equipo.jugadores || equipo.jugadores.length === 0) && (
            <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem', marginBottom: '12px' }}>No hay jugadores todavía</p>
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
            <button type="submit" className="btn btn-outline">Añadir</button>
          </form>
        </div>
      )}

      <div className="flex-between" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Convocatorias</h3>
        {esEntrenador && (
          <button className="btn btn-primary" onClick={() => setCreando(!creando)}>
            {creando ? 'Cancelar' : '+ Nueva convocatoria'}
          </button>
        )}
      </div>

      {creando && (
        <form onSubmit={handleCrearConv} className="card" style={{ marginBottom: '16px' }}>
          <div className="form-group">
            <label>Título</label>
            <input value={formConv.titulo} onChange={e => setFormConv({...formConv, titulo: e.target.value})} placeholder="Ej: Partido vs Alzira" required />
          </div>
          <div className="form-group">
            <label>Descripción</label>
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

      {convocatorias.map(c => {
        const f = formatFecha(c.fecha)
        return (
          <div key={c.id} className="card card-clickable" onClick={() => navigate('/convocatoria/' + c.id)} style={{ marginBottom: '8px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'center', minWidth: '60px', padding: '8px', background: 'var(--fondo)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>{f.dia}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>{f.hora}</div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{c.titulo}</h3>
                {c.lugar && <p style={{ color: 'var(--texto-suave)', fontSize: '0.85rem', marginTop: '2px' }}>{c.lugar}</p>}
                {c.total > 0 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{c.confirmados} confirmados</span>
                    <span style={{ color: 'var(--amarillo)', fontWeight: '600' }}>{c.pendientes} pendientes</span>
                    <span style={{ color: 'var(--rojo)', fontWeight: '600' }}>{c.rechazados} no van</span>
                  </div>
                )}
              </div>
              <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>&#8250;</span>
            </div>
            {esEntrenador && (
              <button className="btn btn-danger" style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', fontSize: '0.7rem' }}
                onClick={e => handleEliminarConv(e, c.id)}>
                Eliminar
              </button>
            )}
          </div>
        )
      })}
      {convocatorias.length === 0 && !creando && (
        <div className="empty-state">
          <div className="empty-icon">&#128197;</div>
          <p>No hay convocatorias todavía</p>
        </div>
      )}
    </div>
  )
}

export default Equipo
