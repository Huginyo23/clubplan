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
      <svg className="login-illust login-illust-left" viewBox="0 0 300 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Futbolista corriendo */}
        <g transform="translate(90, 80)">
          <circle r="13" cy="-52" fill="#D4A574"/>
          <ellipse rx="13" ry="6" cy="-61" fill="#4E342E"/>
          <rect x="-14" y="-39" width="28" height="26" rx="6" fill="#43A047"/>
          <rect x="-11" y="-13" width="22" height="13" rx="3" fill="#2E7D32"/>
          <line x1="-4" y1="0" x2="-13" y2="22" stroke="#D4A574" strokeWidth="7" strokeLinecap="round"/>
          <line x1="5" y1="0" x2="17" y2="17" stroke="#D4A574" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-14" cy="24" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="19" cy="19" rx="7" ry="3.5" fill="#222"/>
          <line x1="-14" y1="-32" x2="-26" y2="-19" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/>
          <line x1="14" y1="-32" x2="26" y2="-24" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="26" cy="22" r="7" fill="white" stroke="#444" strokeWidth="1.5"/>
          <circle cx="26" cy="22" r="2.5" fill="#444"/>
        </g>

        {/* Jugador de baloncesto haciendo mate */}
        <g transform="translate(190, 230)">
          <circle r="13" cy="-68" fill="#8D6E63"/>
          <ellipse rx="13" ry="7" cy="-77" fill="#212121"/>
          <rect x="-14" y="-55" width="28" height="30" rx="6" fill="#E53935"/>
          <rect x="-11" y="-25" width="22" height="16" rx="3" fill="#E53935"/>
          <line x1="-4" y1="-9" x2="-8" y2="12" stroke="#8D6E63" strokeWidth="7" strokeLinecap="round"/>
          <line x1="4" y1="-9" x2="8" y2="12" stroke="#8D6E63" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-9" cy="14" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="9" cy="14" rx="7" ry="3.5" fill="#222"/>
          <line x1="14" y1="-48" x2="22" y2="-74" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round"/>
          <line x1="-14" y1="-48" x2="-20" y2="-40" stroke="#8D6E63" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="24" cy="-78" r="9" fill="#FF8F00" stroke="#BF360C" strokeWidth="1.5"/>
          <line x1="18" y1="-78" x2="30" y2="-78" stroke="#BF360C" strokeWidth="1"/>
          <path d="M24,-87 Q27,-78 24,-69" stroke="#BF360C" strokeWidth="1" fill="none"/>
        </g>

        {/* Jugadora de voleibol sacando */}
        <g transform="translate(70, 400)">
          <circle r="13" cy="-52" fill="#C8956C"/>
          <ellipse rx="14" ry="8" cy="-58" fill="#5D4037"/>
          <rect x="-14" y="-39" width="28" height="26" rx="6" fill="#1E88E5"/>
          <rect x="-11" y="-13" width="22" height="13" rx="3" fill="#0D47A1"/>
          <line x1="-4" y1="0" x2="-6" y2="22" stroke="#C8956C" strokeWidth="7" strokeLinecap="round"/>
          <line x1="4" y1="0" x2="6" y2="22" stroke="#C8956C" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-7" cy="24" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="7" cy="24" rx="7" ry="3.5" fill="#222"/>
          <line x1="14" y1="-34" x2="24" y2="-56" stroke="#C8956C" strokeWidth="5" strokeLinecap="round"/>
          <line x1="-14" y1="-34" x2="-22" y2="-24" stroke="#C8956C" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="26" cy="-60" r="7" fill="#FFFDE7" stroke="#F9A825" strokeWidth="1.5"/>
          <line x1="21" y1="-64" x2="31" y2="-56" stroke="#E65100" strokeWidth="1"/>
          <line x1="21" y1="-56" x2="31" y2="-64" stroke="#1565C0" strokeWidth="1"/>
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

      <svg className="login-illust login-illust-right" viewBox="0 0 300 520" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Jugador de balonmano lanzando */}
        <g transform="translate(200, 80)">
          <circle r="13" cy="-52" fill="#A1887F"/>
          <ellipse rx="13" ry="6" cy="-61" fill="#3E2723"/>
          <rect x="-14" y="-39" width="28" height="26" rx="6" fill="#FDD835"/>
          <rect x="-11" y="-13" width="22" height="13" rx="3" fill="#1565C0"/>
          <line x1="-4" y1="0" x2="-14" y2="20" stroke="#A1887F" strokeWidth="7" strokeLinecap="round"/>
          <line x1="5" y1="0" x2="12" y2="22" stroke="#A1887F" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-15" cy="22" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="13" cy="24" rx="7" ry="3.5" fill="#222"/>
          <line x1="14" y1="-34" x2="28" y2="-52" stroke="#A1887F" strokeWidth="5" strokeLinecap="round"/>
          <line x1="-14" y1="-34" x2="-24" y2="-24" stroke="#A1887F" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="30" cy="-56" r="6" fill="white" stroke="#333" strokeWidth="1.5"/>
        </g>

        {/* Jugador de rugby corriendo */}
        <g transform="translate(100, 250)">
          <circle r="13" cy="-52" fill="#D4A574"/>
          <ellipse rx="13" ry="6" cy="-61" fill="#4E342E"/>
          <rect x="-15" y="-39" width="30" height="28" rx="6" fill="#6A1B9A"/>
          <rect x="-12" y="-11" width="24" height="13" rx="3" fill="#4A148C"/>
          <line x1="-5" y1="2" x2="-16" y2="22" stroke="#D4A574" strokeWidth="7" strokeLinecap="round"/>
          <line x1="5" y1="2" x2="18" y2="16" stroke="#D4A574" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-17" cy="24" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="20" cy="18" rx="7" ry="3.5" fill="#222"/>
          <line x1="-15" y1="-32" x2="-26" y2="-22" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/>
          <line x1="15" y1="-32" x2="26" y2="-40" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="28" cy="-44" rx="8" ry="5" fill="#795548" transform="rotate(-30, 28, -44)"/>
          <line x1="22" y1="-44" x2="34" y2="-44" stroke="#5D4037" strokeWidth="1"/>
        </g>

        {/* Jugadora de hockey celebrando */}
        <g transform="translate(190, 410)">
          <circle r="13" cy="-52" fill="#C8956C"/>
          <ellipse rx="14" ry="7" cy="-58" fill="#212121"/>
          <rect x="-14" y="-39" width="28" height="26" rx="6" fill="#00897B"/>
          <rect x="-11" y="-13" width="22" height="13" rx="3" fill="#004D40"/>
          <line x1="-4" y1="0" x2="-6" y2="22" stroke="#C8956C" strokeWidth="7" strokeLinecap="round"/>
          <line x1="4" y1="0" x2="6" y2="22" stroke="#C8956C" strokeWidth="7" strokeLinecap="round"/>
          <ellipse cx="-7" cy="24" rx="7" ry="3.5" fill="#222"/>
          <ellipse cx="7" cy="24" rx="7" ry="3.5" fill="#222"/>
          <line x1="-14" y1="-34" x2="-22" y2="-54" stroke="#C8956C" strokeWidth="5" strokeLinecap="round"/>
          <line x1="14" y1="-34" x2="22" y2="-54" stroke="#C8956C" strokeWidth="5" strokeLinecap="round"/>
          <line x1="-24" y1="-56" x2="-10" y2="10" stroke="#795548" strokeWidth="3" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  )
}

export default Login
