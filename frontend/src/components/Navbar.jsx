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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{user?.nombre} ({user?.rol})</span>
        <button onClick={logout}>Salir</button>
      </div>
    </nav>
  )
}

export default Navbar
