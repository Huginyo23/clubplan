import { useNavigate } from 'react-router-dom'
import { getUser, removeToken } from '../api'

function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  function logout() {
    removeToken()
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>ClubPlan</h1>
      <div className="navbar-right">
        <span className="navbar-user" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navigate('/perfil')}>
          {user?.foto ? (
            <img src={user.foto} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </span>
          )}
          <strong>{user?.nombre}</strong> · {user?.rol === 'ENTRENADOR' ? 'Entrenador' : 'Jugador'}
        </span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}

export default Navbar
