import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAsistencia, confirmarAsistencia, getConvocatoriaInfo, getUser } from '../api'

function ConvocatoriaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [asistencias, setAsistencias] = useState([])
  const [info, setInfo] = useState(null)

  useEffect(() => {
    getAsistencia(id).then(setAsistencias)
    getConvocatoriaInfo(id).then(setInfo)
  }, [id])

  async function handleConfirmar(estado) {
    await confirmarAsistencia(id, estado)
    getAsistencia(id).then(setAsistencias)
  }

  function exportarPDF() {
    const fecha = info ? new Date(info.fecha).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Convocatoria - ${info?.titulo || ''}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;color:#1a1a2e}h1{font-size:1.5rem;margin-bottom:4px}
.info{color:#6b7280;margin-bottom:20px;font-size:0.9rem}table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{border:1px solid #e5e7eb;padding:10px 14px;text-align:left;font-size:0.9rem}th{background:#f8f9fe;font-weight:700}
.conf{color:#065f46;background:#e8faf9}.rech{color:#991b1b;background:#fff0f0}.pend{color:#92400e;background:#fef9e7}
h2{font-size:1.1rem;margin-top:24px;margin-bottom:8px}</style></head><body>
<h1>${info?.titulo || 'Convocatoria'}</h1>
<div class="info"><strong>${info?.equipoNombre || ''}</strong><br>${fecha}<br>${info?.lugar || ''}</div>
${info?.descripcion ? '<p>' + info.descripcion + '</p>' : ''}
<h2>Jugadores convocados (${asistencias.length})</h2>
<table><tr><th>Jugador</th><th>Estado</th></tr>
${confirmados.map(a => '<tr class="conf"><td>' + a.jugador.nombre + '</td><td>Confirmado</td></tr>').join('')}
${pendientesL.map(a => '<tr class="pend"><td>' + a.jugador.nombre + '</td><td>Pendiente</td></tr>').join('')}
${rechazados.map(a => '<tr class="rech"><td>' + a.jugador.nombre + '</td><td>No va</td></tr>').join('')}
</table><p style="margin-top:24px;font-size:0.8rem;color:#6b7280">Generado con ClubPlan</p></body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
    w.print()
  }

  const miAsistencia = asistencias.find(a => a.jugador.id === user?.id)
  const confirmados = asistencias.filter(a => a.estado === 'CONFIRMADO')
  const rechazados = asistencias.filter(a => a.estado === 'RECHAZADO')
  const pendientesL = asistencias.filter(a => a.estado === 'PENDIENTE')

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ marginBottom: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
        &larr; Volver
      </button>

      <div className="flex-between">
        <div className="page-header" style={{ marginBottom: '0' }}>
          <h2>Asistencia</h2>
          <p>{asistencias.length} jugadores convocados</p>
        </div>
        <button className="btn btn-outline" onClick={exportarPDF} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          &#128196; Exportar PDF
        </button>
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
          <div className="stat-number" style={{ color: 'var(--amarillo)' }}>{pendientesL.length}</div>
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

      {pendientesL.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '10px', color: 'var(--amarillo)' }}>Pendientes ({pendientesL.length})</h3>
          {pendientesL.map(a => (
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
