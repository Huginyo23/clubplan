import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodasConvocatorias } from '../api'

function Calendario() {
  const navigate = useNavigate()
  const [convocatorias, setConvocatorias] = useState([])
  const [mes, setMes] = useState(new Date().getMonth())
  const [anio, setAnio] = useState(new Date().getFullYear())

  useEffect(() => {
    getTodasConvocatorias().then(setConvocatorias)
  }, [])

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  const primerDia = new Date(anio, mes, 1)
  let inicioSemana = primerDia.getDay() - 1
  if (inicioSemana < 0) inicioSemana = 6
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()

  function convsPorDia(dia) {
    return convocatorias.filter(c => {
      const d = new Date(c.fecha)
      return d.getDate() === dia && d.getMonth() === mes && d.getFullYear() === anio
    })
  }

  function mesAnterior() {
    if (mes === 0) { setMes(11); setAnio(anio - 1) }
    else setMes(mes - 1)
  }

  function mesSiguiente() {
    if (mes === 11) { setMes(0); setAnio(anio + 1) }
    else setMes(mes + 1)
  }

  const celdas = []
  for (let i = 0; i < inicioSemana; i++) celdas.push(null)
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d)

  const hoy = new Date()
  const esHoy = (dia) => dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
        &larr; Volver
      </button>

      <div className="page-header">
        <h2>Calendario</h2>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={mesAnterior}>&larr;</button>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{meses[mes]} {anio}</h3>
          <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={mesSiguiente}>&rarr;</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {diasSemana.map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: '700', fontSize: '0.75rem', color: 'var(--texto-suave)', padding: '8px 0', textTransform: 'uppercase' }}>{d}</div>
          ))}
          {celdas.map((dia, i) => {
            if (!dia) return <div key={'e' + i} />
            const convs = convsPorDia(dia)
            return (
              <div key={dia} style={{ minHeight: '70px', padding: '4px', borderRadius: '8px', border: esHoy(dia) ? '2px solid var(--primary)' : '1px solid var(--borde)', background: esHoy(dia) ? 'rgba(108, 92, 231, 0.05)' : 'transparent' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: esHoy(dia) ? '700' : '500', color: esHoy(dia) ? 'var(--primary)' : 'var(--texto)', marginBottom: '2px' }}>{dia}</div>
                {convs.map(c => (
                  <div key={c.id} onClick={() => navigate('/convocatoria/' + c.id)} style={{ fontSize: '0.65rem', background: 'var(--primary)', color: 'white', borderRadius: '4px', padding: '2px 4px', marginBottom: '2px', cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {c.titulo}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendario
