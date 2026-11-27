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
        <span className="navbar-user" style={{ cursor: 'pointer' }} onClick={() => navigate('/perfil')}><strong>{user?.nombre}</strong> · {user?.rol === 'ENTRENADOR' ? 'Entrenador' : 'Jugador'}</span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}

export default Navbar
