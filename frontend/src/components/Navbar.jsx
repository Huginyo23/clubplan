import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, removeToken, getPendientes } from '../api'

function Navbar() {
  const navigate = useNavigate()
  const user = getUser()
  const [dark, setDark] = useState(localStorage.getItem('tema') === 'dark')
  const [pendientes, setPendientes] = useState(0)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('tema', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    getPendientes().then(data => {
      if (data?.pendientes) setPendientes(data.pendientes)
    })
  }, [])

  function logout() {
    removeToken()
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  }

  function navegar(ruta) {
    navigate(ruta)
    setMenuAbierto(false)
  }

  return (
    <nav className="navbar">
      <h1 style={{ cursor: 'pointer' }} onClick={() => navegar('/')}>ClubPlan</h1>
      <button className="navbar-menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
        {menuAbierto ? '✕' : '☰'}
      </button>
      <div className={'navbar-right' + (menuAbierto ? ' open' : '')}>
        {pendientes > 0 && (
          <span className="notif-badge" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => navegar('/')}>
            &#128276;
            <span className="badge-count">{pendientes}</span>
          </span>
        )}
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? '☀️' : '🌙'}
        </button>
        <span className="navbar-user" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => navegar('/perfil')}>
          {user?.foto ? (
            <img src={user.foto} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }} />
          ) : (
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700' }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </span>
          )}
          <strong>{user?.nombre}</strong>
        </span>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </nav>
  )
}

export default Navbar
