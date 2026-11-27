import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAsistencia, confirmarAsistencia, getUser } from '../api'

function ConvocatoriaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [asistencias, setAsistencias] = useState([])

  useEffect(() => {
    getAsistencia(id).then(setAsistencias)
  }, [id])

  async function handleConfirmar(estado) {
    await confirmarAsistencia(id, estado)
    getAsistencia(id).then(setAsistencias)
  }

  const miAsistencia = asistencias.find(a => a.jugador.id === user?.id)
  const confirmados = asistencias.filter(a => a.estado === 'CONFIRMADO')
  const rechazados = asistencias.filter(a => a.estado === 'RECHAZADO')
  const pendientes = asistencias.filter(a => a.estado === 'PENDIENTE')

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
        &larr; Volver
      </button>

      <div className="page-header">
        <h2>Asistencia</h2>
        <p>{asistencias.length} jugadores convocados</p>
      </div>

      <div className="stat-cards" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--accent)' }}>{confirmados.length}</div>
          <p>Confirmados</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--rojo)' }}>{rechazados.length}</div>
          <p>No van</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--amarillo)' }}>{pendientes.length}</div>
          <p>Pendientes</p>
        </div>
      </div>

      {miAsistencia && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: '700' }}>Tu respuesta</h3>
          <p style={{ marginBottom: '16px' }}>
            Estado actual: <span className={'badge badge-' + miAsistencia.estado.toLowerCase()}>{miAsistencia.estado}</span>
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-accent" onClick={() => handleConfirmar('CONFIRMADO')}>Confirmar asistencia</button>
            <button className="btn btn-danger" onClick={() => handleConfirmar('RECHAZADO')}>No puedo ir</button>
          </div>
        </div>
      )}

      {confirmados.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--accent)' }}>Confirmados ({confirmados.length})</h3>
          {confirmados.map(a => (
            <div key={a.id} className="card" style={{ padding: '12px 20px', marginBottom: '6px' }}>
              <div className="jugador-row" style={{ borderBottom: 'none', padding: 0 }}>
                <div className="jugador-info">
                  <div className="jugador-avatar">{a.jugador.nombre.charAt(0).toUpperCase()}</div>
                  <span style={{ fontWeight: '600' }}>{a.jugador.nombre}</span>
                </div>
                <span className="badge badge-confirmado">CONFIRMADO</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendientes.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--amarillo)' }}>Pendientes ({pendientes.length})</h3>
          {pendientes.map(a => (
            <div key={a.id} className="card" style={{ padding: '12px 20px', marginBottom: '6px' }}>
              <div className="jugador-row" style={{ borderBottom: 'none', padding: 0 }}>
                <div className="jugador-info">
                  <div className="jugador-avatar">{a.jugador.nombre.charAt(0).toUpperCase()}</div>
                  <span style={{ fontWeight: '600' }}>{a.jugador.nombre}</span>
                </div>
                <span className="badge badge-pendiente">PENDIENTE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {rechazados.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--rojo)' }}>No van ({rechazados.length})</h3>
          {rechazados.map(a => (
            <div key={a.id} className="card" style={{ padding: '12px 20px', marginBottom: '6px' }}>
              <div className="jugador-row" style={{ borderBottom: 'none', padding: 0 }}>
                <div className="jugador-info">
                  <div className="jugador-avatar">{a.jugador.nombre.charAt(0).toUpperCase()}</div>
                  <span style={{ fontWeight: '600' }}>{a.jugador.nombre}</span>
                </div>
                <span className="badge badge-rechazado">RECHAZADO</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {asistencias.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">&#128100;</div>
          <p>No hay jugadores convocados</p>
        </div>
      )}
    </div>
  )
}

export default ConvocatoriaDetalle
