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
    <div className="container" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '20px' }}>Registro</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <select value={rol} onChange={e => setRol(e.target.value)}>
              <option value="ENTRENADOR">Entrenador</option>
              <option value="JUGADOR">Jugador</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Registrarme</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
