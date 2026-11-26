import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register, setToken, setUser } from '../api'

function Register() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState('JUGADOR')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const data = await register(nombre, email, password, rol)
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
        <h2>Crear cuenta</h2>
        <p className="login-subtitle">Unete a tu equipo</p>
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
            <label>Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contrasena" required />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={rol} onChange={e => setRol(e.target.value)}>
              <option value="ENTRENADOR">Entrenador</option>
              <option value="JUGADOR">Jugador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Registrarme</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--texto-suave)' }}>
          Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
