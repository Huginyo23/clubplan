import { useState, useEffect } from 'react'
import { getLigas, crearLiga, eliminarLiga, getPartidos, addPartido, editarPartido, eliminarPartido, getLigaStats } from '../api'

function LigaSection({ equipoId, esEntrenador }) {
  const [ligas, setLigas] = useState([])
  const [ligaActiva, setLigaActiva] = useState(null)
  const [partidos, setPartidos] = useState([])
  const [stats, setStats] = useState(null)
  const [creandoLiga, setCreandoLiga] = useState(false)
  const [formLiga, setFormLiga] = useState({ nombre: '', temporada: '', grupo: '' })
  const [creandoPartido, setCreandoPartido] = useState(false)
  const [formPartido, setFormPartido] = useState({ jornada: '', rival: '', golesPropio: '', golesRival: '', fecha: '', esLocal: true })
  const [verLiga, setVerLiga] = useState(false)

  useEffect(() => {
    getLigas(equipoId).then(data => {
      setLigas(data)
      if (data.length > 0) setLigaActiva(data[0])
    })
  }, [equipoId])

  useEffect(() => {
    if (!ligaActiva) return
    getPartidos(ligaActiva.id).then(setPartidos)
    getLigaStats(ligaActiva.id).then(setStats)
  }, [ligaActiva])

  function recargar() {
    getPartidos(ligaActiva.id).then(setPartidos)
    getLigaStats(ligaActiva.id).then(setStats)
  }

  async function handleCrearLiga(e) {
    e.preventDefault()
    await crearLiga(equipoId, formLiga.nombre, formLiga.temporada, formLiga.grupo)
    setFormLiga({ nombre: '', temporada: '', grupo: '' })
    setCreandoLiga(false)
    const data = await getLigas(equipoId)
    setLigas(data)
    if (data.length > 0) setLigaActiva(data[data.length - 1])
  }

  async function handleEliminarLiga() {
    if (!confirm('¿Eliminar esta liga y todos sus partidos?')) return
    await eliminarLiga(ligaActiva.id)
    const data = await getLigas(equipoId)
    setLigas(data)
    setLigaActiva(data.length > 0 ? data[0] : null)
    setPartidos([])
    setStats(null)
  }

  async function handleAddPartido(e) {
    e.preventDefault()
    await addPartido(ligaActiva.id, {
      jornada: parseInt(formPartido.jornada),
      rival: formPartido.rival,
      golesPropio: parseInt(formPartido.golesPropio),
      golesRival: parseInt(formPartido.golesRival),
      fecha: formPartido.fecha || null,
      esLocal: formPartido.esLocal
    })
    setFormPartido({ jornada: '', rival: '', golesPropio: '', golesRival: '', fecha: '', esLocal: true })
    setCreandoPartido(false)
    recargar()
  }

  async function handleEliminarPartido(pid) {
    if (!confirm('¿Eliminar este partido?')) return
    await eliminarPartido(pid)
    recargar()
  }

  function getResultado(p) {
    if (p.golesPropio > p.golesRival) return 'V'
    if (p.golesPropio < p.golesRival) return 'D'
    return 'E'
  }

  function getResultadoColor(r) {
    if (r === 'V') return 'var(--accent)'
    if (r === 'D') return 'var(--rojo)'
    return 'var(--amarillo)'
  }

  const ultimos5 = partidos.slice(-5).map(getResultado)

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div className="flex-between" style={{ marginBottom: '0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>&#127942; Liga</h3>
        <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => setVerLiga(!verLiga)}>
          {verLiga ? 'Ocultar' : 'Ver'}
        </button>
      </div>

      {verLiga && (
        <div style={{ marginTop: '16px' }}>
          {ligas.length > 1 && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {ligas.map(l => (
                <button key={l.id} onClick={() => setLigaActiva(l)}
                  className={ligaActiva?.id === l.id ? 'btn btn-primary' : 'btn btn-outline'}
                  style={{ padding: '6px 14px', fontSize: '0.8rem', transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                  {l.nombre}
                </button>
              ))}
            </div>
          )}

          {ligaActiva && (
            <>
              <div style={{ padding: '16px', background: 'var(--fondo)', borderRadius: '12px', marginBottom: '16px', border: '1px solid var(--borde)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{ligaActiva.nombre}</div>
                    <div style={{ color: 'var(--texto-suave)', fontSize: '0.85rem', marginTop: '2px' }}>
                      {ligaActiva.temporada && <span>{ligaActiva.temporada}</span>}
                      {ligaActiva.grupo && <span> &middot; {ligaActiva.grupo}</span>}
                    </div>
                  </div>
                  {esEntrenador && (
                    <button onClick={handleEliminarLiga} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.7rem' }}>
                      Eliminar
                    </button>
                  )}
                </div>

                {stats && stats.pj > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      {[
                        { label: 'PJ', value: stats.pj },
                        { label: 'PG', value: stats.pg },
                        { label: 'PE', value: stats.pe },
                        { label: 'PP', value: stats.pp },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--blanco)', borderRadius: '8px', border: '1px solid var(--borde)' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--texto-suave)', textTransform: 'uppercase' }}>{s.label}</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {[
                        { label: 'GF', value: stats.gf },
                        { label: 'GC', value: stats.gc },
                        { label: 'DIF', value: (stats.dif >= 0 ? '+' : '') + stats.dif },
                        { label: 'PTS', value: stats.pts, highlight: true },
                      ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center', padding: '8px 4px', background: s.highlight ? 'var(--primary)' : 'var(--blanco)', color: s.highlight ? 'white' : 'var(--texto)', borderRadius: '8px', border: '1px solid var(--borde)' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.7, textTransform: 'uppercase' }}>{s.label}</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>

                    {ultimos5.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--texto-suave)' }}>Últimos:</span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {ultimos5.map((r, i) => (
                            <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: getResultadoColor(r), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: '800' }}>
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Partidos</span>
                {esEntrenador && (
                  <button onClick={() => setCreandoPartido(!creandoPartido)} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                    {creandoPartido ? 'Cancelar' : '+ Partido'}
                  </button>
                )}
              </div>

              {creandoPartido && (
                <form onSubmit={handleAddPartido} style={{ padding: '14px', background: 'var(--fondo)', borderRadius: '10px', marginBottom: '12px', border: '1px solid var(--borde)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Jornada</label>
                      <input type="number" value={formPartido.jornada} onChange={e => setFormPartido({...formPartido, jornada: e.target.value})} required
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Rival</label>
                      <input value={formPartido.rival} onChange={e => setFormPartido({...formPartido, rival: e.target.value})} placeholder="Nombre del rival" required
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Goles propios</label>
                      <input type="number" min="0" value={formPartido.golesPropio} onChange={e => setFormPartido({...formPartido, golesPropio: e.target.value})} required
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Goles rival</label>
                      <input type="number" min="0" value={formPartido.golesRival} onChange={e => setFormPartido({...formPartido, golesRival: e.target.value})} required
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Fecha</label>
                      <input type="datetime-local" value={formPartido.fecha} onChange={e => setFormPartido({...formPartido, fecha: e.target.value})}
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formPartido.esLocal} onChange={e => setFormPartido({...formPartido, esLocal: e.target.checked})} />
                      Jugamos en casa
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Añadir partido</button>
                </form>
              )}

              {partidos.map(p => {
                const r = getResultado(p)
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '4px', borderRadius: '10px', background: 'var(--fondo)', border: '1px solid var(--borde)', transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                    <div style={{ minWidth: '28px', textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: 'var(--texto-suave)' }}>J{p.jornada}</div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: getResultadoColor(r), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: '800', flexShrink: 0 }}>
                      {r}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.esLocal ? 'vs ' : '@ '}{p.rival}
                      </div>
                      {p.fecha && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--texto-suave)' }}>
                          {new Date(p.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1rem', fontVariantNumeric: 'tabular-nums' }}>
                      {p.golesPropio} - {p.golesRival}
                    </div>
                    {esEntrenador && (
                      <button onClick={() => handleEliminarPartido(p.id)} className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.65rem', flexShrink: 0 }}>
                        &#10005;
                      </button>
                    )}
                  </div>
                )
              })}
              {partidos.length === 0 && (
                <p style={{ color: 'var(--texto-suave)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>No hay partidos registrados</p>
              )}
            </>
          )}

          {!ligaActiva && !creandoLiga && (
            <p style={{ color: 'var(--texto-suave)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>No hay ligas configuradas</p>
          )}

          {esEntrenador && (
            <div style={{ marginTop: '12px' }}>
              {!creandoLiga ? (
                <button onClick={() => setCreandoLiga(true)} className="btn btn-outline" style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}>
                  + Nueva liga
                </button>
              ) : (
                <form onSubmit={handleCrearLiga} style={{ padding: '14px', background: 'var(--fondo)', borderRadius: '10px', border: '1px solid var(--borde)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Nombre</label>
                      <input value={formLiga.nombre} onChange={e => setFormLiga({...formLiga, nombre: e.target.value})} placeholder="Ej: Primera Autonómica" required
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Temporada</label>
                      <input value={formLiga.temporada} onChange={e => setFormLiga({...formLiga, temporada: e.target.value})} placeholder="Ej: 2026/2027"
                        style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '600', marginBottom: '4px' }}>Grupo</label>
                    <input value={formLiga.grupo} onChange={e => setFormLiga({...formLiga, grupo: e.target.value})} placeholder="Ej: Sur"
                      style={{ width: '100%', padding: '8px', border: '2px solid var(--borde)', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Crear liga</button>
                    <button type="button" className="btn btn-outline" onClick={() => setCreandoLiga(false)} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LigaSection
