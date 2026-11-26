import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAsistencia, confirmarAsistencia, getUser } from '../api'

function ConvocatoriaDetalle() {
  const { id } = useParams()
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
  const confirmados = asistencias.filter(a => a.estado === 'CONFIRMADO').length
  const rechazados = asistencias.filter(a => a.estado === 'RECHAZADO').length
  const pendientes = asistencias.filter(a => a.estado === 'PENDIENTE').length

  return (
    <div className="container">
      <div className="page-header">
        <h2>Asistencia</h2>
        <p>{asistencias.length} jugadores convocados</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--accent)' }}>{confirmados}</div>
          <p>Confirmados</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--rojo)' }}>{rechazados}</div>
          <p>Rechazados</p>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--amarillo)' }}>{pendientes}</div>
          <p>Pendientes</p>
        </div>
      </div>

      {miAsistencia && (
        <div className="card">
          <h3 style={{ marginBottom: '12px' }}>Tu respuesta</h3>
          <p style={{ marginBottom: '16px' }}>
            Estado actual: <span className={'badge badge-' + miAsistencia.estado.toLowerCase()}>{miAsistencia.estado}</span>
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-accent" onClick={() => handleConfirmar('CONFIRMADO')}>Confirmar asistencia</button>
            <button className="btn btn-danger" onClick={() => handleConfirmar('RECHAZADO')}>No puedo ir</button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '28px', marginBottom: '16px', fontSize: '1.1rem', fontWeight: '700' }}>Lista de jugadores</h3>
      {asistencias.map(a => (
        <div key={a.id} className="card" style={{ padding: '16px 24px' }}>
          <div className="jugador-row" style={{ borderBottom: 'none', padding: 0 }}>
            <div className="jugador-info">
              <div className="jugador-avatar">{a.jugador.nombre.charAt(0).toUpperCase()}</div>
              <span style={{ fontWeight: '600' }}>{a.jugador.nombre}</span>
            </div>
            <span className={'badge badge-' + a.estado.toLowerCase()}>{a.estado}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConvocatoriaDetalle
