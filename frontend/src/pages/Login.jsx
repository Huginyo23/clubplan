import { useState, useLayoutEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, setToken, setUser } from '../api'

const BALLS = [
  { size: 55, speed: 0.8, rot: 0.6 },
  { size: 60, speed: 1, rot: -0.5 },
  { size: 48, speed: 1.2, rot: 0.7 },
  { size: 42, speed: 1.4, rot: -0.9 },
  { size: 54, speed: 0.9, rot: 0.4 },
  { size: 46, speed: 1.1, rot: -0.7 },
  { size: 38, speed: 1.3, rot: 0.8 },
]

function BallSVG({ index, size }) {
  const s = size
  if (index === 0) return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#fff"/>
      <path d="M25,4 L29,14 L25,18 L21,14 Z" fill="#333"/>
      <path d="M9,19 L19,14 L19,23 L11,27 Z" fill="#333"/>
      <path d="M41,19 L31,14 L31,23 L39,27 Z" fill="#333"/>
      <path d="M15,39 L20,28 L25,32 L22,43 Z" fill="#333"/>
      <path d="M35,39 L30,28 L25,32 L28,43 Z" fill="#333"/>
    </svg>
  )
  if (index === 1) return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#FF8F00"/>
      <line x1="1" y1="25" x2="49" y2="25" stroke="#BF360C" strokeWidth="2"/>
      <line x1="25" y1="1" x2="25" y2="49" stroke="#BF360C" strokeWidth="2"/>
      <path d="M7,8 Q25,22 43,8" fill="none" stroke="#BF360C" strokeWidth="2"/>
      <path d="M7,42 Q25,28 43,42" fill="none" stroke="#BF360C" strokeWidth="2"/>
    </svg>
  )
  if (index === 2) return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#FFFDE7" stroke="#ccc" strokeWidth="1"/>
      <path d="M5,16 Q25,32 45,16" fill="none" stroke="#1565C0" strokeWidth="2"/>
      <path d="M5,34 Q25,18 45,34" fill="none" stroke="#C62828" strokeWidth="2"/>
      <path d="M25,1 Q28,25 25,49" fill="none" stroke="#F9A825" strokeWidth="2"/>
    </svg>
  )
  if (index === 3) return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#C6FF00"/>
      <path d="M12,4 Q4,25 12,46" fill="none" stroke="#fff" strokeWidth="3.5"/>
      <path d="M38,4 Q46,25 38,46" fill="none" stroke="#fff" strokeWidth="3.5"/>
    </svg>
  )
  if (index === 4) return (
    <svg width={s} height={s} viewBox="0 0 60 40">
      <ellipse cx="30" cy="20" rx="29" ry="19" fill="#8D6E63"/>
      <line x1="12" y1="20" x2="48" y2="20" stroke="#5D4037" strokeWidth="2"/>
      <line x1="30" y1="4" x2="30" y2="36" stroke="#5D4037" strokeWidth="1.5"/>
      <line x1="26" y1="5" x2="26" y2="35" stroke="#5D4037" strokeWidth="0.8"/>
      <line x1="34" y1="5" x2="34" y2="35" stroke="#5D4037" strokeWidth="0.8"/>
    </svg>
  )
  if (index === 5) return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#FAFAFA" stroke="#ccc" strokeWidth="1"/>
      <path d="M14,4 Q4,25 14,46" fill="none" stroke="#E53935" strokeWidth="2.5"/>
      <path d="M36,4 Q46,25 36,46" fill="none" stroke="#E53935" strokeWidth="2.5"/>
    </svg>
  )
  return (
    <svg width={s} height={s} viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="24" fill="#fff" stroke="#aaa" strokeWidth="1"/>
      <circle cx="25" cy="25" r="4" fill="#E53935"/>
      <path d="M5,25 Q25,15 45,25" fill="none" stroke="#1565C0" strokeWidth="2"/>
      <path d="M5,25 Q25,35 45,25" fill="none" stroke="#E53935" strokeWidth="2"/>
    </svg>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const cardRef = useRef(null)
  const iconRefs = useRef([])
  const dataRef = useRef([])
  const cardBounds = useRef(null)

  function calcCardBounds() {
    const c = containerRef.current
    const el = cardRef.current
    if (!c || !el) return
    const cR = c.getBoundingClientRect()
    const eR = el.getBoundingClientRect()
    cardBounds.current = {
      left: eR.left - cR.left - 20,
      top: eR.top - cR.top - 20,
      right: eR.right - cR.left + 20,
      bottom: eR.bottom - cR.top + 20,
    }
  }

  function overlapsCard(x, y, size) {
    const cb = cardBounds.current
    if (!cb) return false
    return x + size > cb.left && x < cb.right && y + size > cb.top && y < cb.bottom
  }

  useLayoutEffect(() => {
    const c = containerRef.current
    if (!c) return
    const w = c.clientWidth
    const h = c.clientHeight

    calcCardBounds()

    dataRef.current = BALLS.map((b, i) => {
      let x, y, tries = 0
      do {
        x = Math.random() * (w - b.size)
        y = Math.random() * (h - b.size)
        tries++
      } while (tries < 100 && overlapsCard(x, y, b.size))

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

    function onResize() { calcCardBounds() }
    window.addEventListener('resize', onResize)

    let frameId
    function tick() {
      const c = containerRef.current
      if (!c) return
      const w = c.clientWidth
      const h = c.clientHeight
      const cb = cardBounds.current

      dataRef.current.forEach((d, i) => {
        d.x += d.dx
        d.y += d.dy
        d.r += d.dr

        if (d.x <= 0) { d.x = 0; d.dx = Math.abs(d.dx); }
        if (d.x >= w - d.size) { d.x = w - d.size; d.dx = -Math.abs(d.dx); }
        if (d.y <= 0) { d.y = 0; d.dy = Math.abs(d.dy); }
        if (d.y >= h - d.size) { d.y = h - d.size; d.dy = -Math.abs(d.dy); }

        if (cb && d.x + d.size > cb.left && d.x < cb.right && d.y + d.size > cb.top && d.y < cb.bottom) {
          const oL = d.x + d.size - cb.left
          const oR = cb.right - d.x
          const oT = d.y + d.size - cb.top
          const oB = cb.bottom - d.y
          const min = Math.min(oL, oR, oT, oB)
          if (min === oL) { d.x = cb.left - d.size; d.dx = -Math.abs(d.dx); }
          else if (min === oR) { d.x = cb.right; d.dx = Math.abs(d.dx); }
          else if (min === oT) { d.y = cb.top - d.size; d.dy = -Math.abs(d.dy); }
          else { d.y = cb.bottom; d.dy = Math.abs(d.dy); }
        }

        if (iconRefs.current[i])
          iconRefs.current[i].style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) rotate(' + d.r + 'deg)'
      })

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const data = await login(email, password)
    if (data.error) {
      setError(data.error)
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
          <BallSVG index={i} size={b.size} />
        </div>
      ))}

      <div className="login-card" ref={cardRef}>
        <div className="login-logo">ClubPlan</div>
        <h2>Iniciar sesion</h2>
        <p className="login-subtitle">Gestiona tus equipos y convocatorias</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div className="form-group">
            <label>Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contrasena" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Entrar</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--texto-suave)' }}>
          No tienes cuenta? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Registrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
