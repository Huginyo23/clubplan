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
      <h2>Asistencia</h2>

      <div style={{ display: 'flex', gap: '16px', margin: '16px 0' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--verde)' }}>{confirmados}</div>
          <p>Confirmados</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--rojo)' }}>{rechazados}</div>
          <p>Rechazados</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#92400e' }}>{pendientes}</div>
          <p>Pendientes</p>
        </div>
      </div>

      {miAsistencia && (
        <div className="card">
          <h3>Tu respuesta</h3>
          <p style={{ marginBottom: '12px' }}>
            Estado actual: <span className={'badge badge-' + miAsistencia.estado.toLowerCase()}>{miAsistencia.estado}</span>
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-primary" onClick={() => handleConfirmar('CONFIRMADO')}>Confirmar</button>
            <button className="btn btn-danger" onClick={() => handleConfirmar('RECHAZADO')}>Rechazar</button>
          </div>
        </div>
      )}

      <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Lista de jugadores</h3>
      {asistencias.map(a => (
        <div key={a.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{a.jugador.nombre}</span>
          <span className={'badge badge-' + a.estado.toLowerCase()}>{a.estado}</span>
        </div>
      ))}
    </div>
  )
}

export default ConvocatoriaDetalle
