import { useState, useLayoutEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register, setToken, setUser } from '../api'

const BALL_IMAGES = ['/balls/soccer.png', '/balls/basketball.png', '/balls/tennis.png', '/balls/volleyball.png', '/balls/football.png', '/balls/baseball.png']

const BALLS = [
  { size: 120, speed: 2.5, rot: 1.2 },
  { size: 140, speed: 3, rot: -1 },
  { size: 110, speed: 2.8, rot: 1.4 },
  { size: 130, speed: 2.2, rot: 0.9 },
  { size: 105, speed: 3.2, rot: -1.3 },
  { size: 100, speed: 3.5, rot: 1.5 },
]

function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('JUGADOR')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const iconRefs = useRef([])
  const dataRef = useRef([])

  function getCardBounds(c, cardEl) {
    const cR = c.getBoundingClientRect()
    const eR = cardEl.getBoundingClientRect()
    return {
      left: eR.left - cR.left - 30,
      top: eR.top - cR.top - 30,
      right: eR.right - cR.left + 30,
      bottom: eR.bottom - cR.top + 30,
    }
  }

  useLayoutEffect(() => {
    const c = containerRef.current
    const cardEl = cardRef.current
    if (!c || !cardEl) return
    const w = c.clientWidth
    const h = c.clientHeight
    const cb = getCardBounds(c, cardEl)

    dataRef.current = BALLS.map((b, i) => {
      let x, y, tries = 0
      do {
        x = Math.random() * (w - b.size)
        y = Math.random() * (h - b.size)
        tries++
      } while (tries < 100 && x + b.size > cb.left && x < cb.right && y + b.size > cb.top && y < cb.bottom)

      const angle = (Math.PI * 2 / BALLS.length) * i + Math.random() * 0.5
      return {
        x, y,
        dx: Math.cos(angle) * b.speed,
        dy: Math.sin(angle) * b.speed,
        r: Math.random() * 360,
        dr: b.rot,
        size: b.size,
      }
    })

    dataRef.current.forEach((d, i) => {
      if (iconRefs.current[i])
        iconRefs.current[i].style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) rotate(' + d.r + 'deg)'
    })

    let frameId
    function tick() {
      const c = containerRef.current
      const cardEl = cardRef.current
      if (!c || !cardEl) return
      const w = c.clientWidth
      const h = c.clientHeight
      const cb = getCardBounds(c, cardEl)

      dataRef.current.forEach((d, i) => {
        let nx = d.x + d.dx
        let ny = d.y + d.dy
        d.r += d.dr

        if (nx <= 0) { nx = 0; d.dx = Math.abs(d.dx) }
        if (nx >= w - d.size) { nx = w - d.size; d.dx = -Math.abs(d.dx) }
        if (ny <= 0) { ny = 0; d.dy = Math.abs(d.dy) }
        if (ny >= h - d.size) { ny = h - d.size; d.dy = -Math.abs(d.dy) }

        if (nx + d.size > cb.left && nx < cb.right && ny + d.size > cb.top && ny < cb.bottom) {
          const inX = d.x + d.size > cb.left && d.x < cb.right
          const inY = d.y + d.size > cb.top && d.y < cb.bottom
          if (!inX) {
            d.dx = -d.dx
            nx = d.x + d.dx
          }
          if (!inY) {
            d.dy = -d.dy
            ny = d.y + d.dy
          }
          if (inX && inY) {
            d.dx = -d.dx
            d.dy = -d.dy
            nx = d.x + d.dx
            ny = d.y + d.dy
          }
        }

        d.x = nx
        d.y = ny

        if (iconRefs.current[i])
          iconRefs.current[i].style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) rotate(' + d.r + 'deg)'
      })

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const data = await register(nombre, email, password, rol)
    setLoading(false)
    if (data.error) {
      setError('Ha habido un error al crear la cuenta')
    } else {
      setToken(data.token)
      setUser(data.usuario)
      navigate('/')
    }
  }

  return (
    <div className="login-bg" ref={containerRef}>
      {BALLS.map((b, i) => (
        <div key={i} ref={el => iconRefs.current[i] = el} className="bouncing-icon">
          <img src={BALL_IMAGES[i]} alt="" width={b.size} height={b.size} draggable="false" />
        </div>
      ))}

      <div className="login-card" ref={cardRef}>
        <div className="login-logo" title="Gestión deportiva">ClubPlan</div>
        <h2>Crear cuenta</h2>
        <p className="login-subtitle">Únete a tu equipo</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--texto-suave)', fontSize: '0.85rem', fontWeight: '500' }}>
                {showPass ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={rol} onChange={e => setRol(e.target.value)}>
              <option value="ENTRENADOR">Entrenador</option>
              <option value="JUGADOR">Jugador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : <>Registrarme <span style={{ marginLeft: '6px' }}>&rarr;</span></>}
          </button>
        </form>
        <div style={{ borderTop: '1px solid var(--borde)', margin: '20px 0' }} />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--texto-suave)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
