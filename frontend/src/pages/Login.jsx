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
    </div>
  )
}

export default Login
