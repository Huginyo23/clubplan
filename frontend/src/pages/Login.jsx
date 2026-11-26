import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, setToken, setUser } from '../api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
    <div className="login-bg">
      <svg className="login-illust login-illust-left" viewBox="0 0 350 550" xmlns="http://www.w3.org/2000/svg">
        {/* Futbolista chutando */}
        <g className="jug-1">
          <g transform="translate(140, 100)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="-2" cy="0" r="16" stroke="none"/>
            <rect x="-15" y="14" width="26" height="40" rx="8" stroke="none"/>
            <line x1="-15" y1="24" x2="-32" y2="40" strokeWidth="9" strokeLinecap="round"/>
            <line x1="11" y1="24" x2="28" y2="14" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-6" y1="54" x2="-20" y2="92" strokeWidth="10" strokeLinecap="round"/>
            <line x1="4" y1="54" x2="38" y2="74" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-22" cy="96" rx="12" ry="6" stroke="none"/>
            <ellipse cx="42" cy="76" rx="12" ry="6" stroke="none" transform="rotate(-40, 42, 76)"/>
            <circle cx="50" cy="68" r="10" stroke="none"/>
          </g>
        </g>

        {/* Jugador de baloncesto haciendo mate */}
        <g className="jug-2">
          <g transform="translate(220, 280)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="0" cy="-10" r="16" stroke="none"/>
            <rect x="-15" y="4" width="30" height="42" rx="8" stroke="none"/>
            <line x1="12" y1="10" x2="22" y2="-22" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-12" y1="14" x2="-26" y2="26" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-5" y1="46" x2="-20" y2="80" strokeWidth="10" strokeLinecap="round"/>
            <line x1="5" y1="46" x2="18" y2="82" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-22" cy="84" rx="12" ry="6" stroke="none"/>
            <ellipse cx="20" cy="86" rx="12" ry="6" stroke="none"/>
            <circle cx="24" cy="-28" r="11" stroke="none"/>
          </g>
        </g>

        {/* Jugador de voleibol rematando */}
        <g className="jug-3">
          <g transform="translate(100, 440)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="0" cy="-8" r="16" stroke="none"/>
            <rect x="-15" y="6" width="30" height="40" rx="8" stroke="none"/>
            <line x1="12" y1="10" x2="30" y2="-14" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-12" y1="14" x2="-28" y2="4" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-5" y1="46" x2="-12" y2="82" strokeWidth="10" strokeLinecap="round"/>
            <line x1="5" y1="46" x2="14" y2="82" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-14" cy="86" rx="12" ry="6" stroke="none"/>
            <ellipse cx="16" cy="86" rx="12" ry="6" stroke="none"/>
            <circle cx="34" cy="-22" r="9" stroke="none"/>
          </g>
        </g>
      </svg>

      <div className="login-card">
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

      <svg className="login-illust login-illust-right" viewBox="0 0 350 550" xmlns="http://www.w3.org/2000/svg">
        {/* Jugador de rugby corriendo */}
        <g className="jug-4">
          <g transform="translate(180, 100)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="6" cy="0" r="16" stroke="none"/>
            <rect x="-10" y="14" width="30" height="42" rx="8" stroke="none" transform="rotate(10, 5, 35)"/>
            <line x1="16" y1="22" x2="30" y2="36" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-6" y1="24" x2="-24" y2="16" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-2" y1="54" x2="-24" y2="88" strokeWidth="10" strokeLinecap="round"/>
            <line x1="10" y1="54" x2="32" y2="82" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-26" cy="92" rx="12" ry="6" stroke="none"/>
            <ellipse cx="34" cy="86" rx="12" ry="6" stroke="none"/>
            <ellipse cx="34" cy="34" rx="11" ry="7" stroke="none" transform="rotate(30, 34, 34)"/>
          </g>
        </g>

        {/* Jugador de hockey */}
        <g className="jug-5">
          <g transform="translate(130, 290)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="4" cy="0" r="16" stroke="none"/>
            <rect x="-12" y="14" width="28" height="40" rx="8" stroke="none" transform="rotate(12, 2, 34)"/>
            <line x1="-8" y1="20" x2="-24" y2="40" strokeWidth="9" strokeLinecap="round"/>
            <line x1="12" y1="22" x2="26" y2="40" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-4" y1="52" x2="-22" y2="86" strokeWidth="10" strokeLinecap="round"/>
            <line x1="6" y1="52" x2="20" y2="88" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-24" cy="90" rx="12" ry="6" stroke="none"/>
            <ellipse cx="22" cy="92" rx="12" ry="6" stroke="none"/>
            <line x1="28" y1="42" x2="46" y2="86" strokeWidth="5" strokeLinecap="round"/>
            <rect x="40" y="84" width="18" height="5" rx="2" stroke="none"/>
            <circle cx="52" cy="90" r="5" stroke="none"/>
          </g>
        </g>

        {/* Jugador de balonmano lanzando */}
        <g className="jug-6">
          <g transform="translate(220, 440)" opacity="0.22" fill="#fff" stroke="#fff">
            <circle cx="0" cy="-6" r="16" stroke="none"/>
            <rect x="-15" y="8" width="30" height="42" rx="8" stroke="none"/>
            <line x1="12" y1="14" x2="24" y2="-16" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-12" y1="18" x2="-28" y2="8" strokeWidth="9" strokeLinecap="round"/>
            <line x1="-5" y1="50" x2="-18" y2="84" strokeWidth="10" strokeLinecap="round"/>
            <line x1="5" y1="50" x2="22" y2="82" strokeWidth="10" strokeLinecap="round"/>
            <ellipse cx="-20" cy="88" rx="12" ry="6" stroke="none"/>
            <ellipse cx="24" cy="86" rx="12" ry="6" stroke="none"/>
            <circle cx="26" cy="-22" r="8" stroke="none"/>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Login
