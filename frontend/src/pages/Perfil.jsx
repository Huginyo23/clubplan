import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPerfil, editarPerfil, getUser, setUser } from '../api'

function Perfil() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('')
  const [foto, setFoto] = useState(null)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    getPerfil().then(data => {
      setNombre(data.nombre)
      setEmail(data.email)
      setRol(data.rol)
      setFoto(data.foto || null)
    })
  }, [])

  function handleFoto(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 500000) {
      setMensaje('La imagen no puede superar 500 KB')
      setTimeout(() => setMensaje(''), 3000)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFoto(reader.result)
    reader.readAsDataURL(file)
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setGuardando(true)
    const data = await editarPerfil(nombre, password, foto)
    setGuardando(false)
    if (data.usuario) {
      setUser(data.usuario)
      setPassword('')
      setMensaje('Perfil actualizado correctamente')
      setTimeout(() => setMensaje(''), 3000)
    }
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/')} className="btn btn-outline" style={{ marginBottom: '16px', padding: '8px 16px', fontSize: '0.85rem' }}>
        &larr; Volver
      </button>

      <div className="page-header">
        <h2>Mi perfil</h2>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--borde)' }}>
          <div style={{ position: 'relative' }}>
            {foto ? (
              <img src={foto} alt="Foto" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700' }}>
                {nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <label style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem', border: '2px solid white' }}>
              &#9998;
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{nombre}</h3>
            <p style={{ color: 'var(--texto-suave)', fontSize: '0.9rem' }}>{email}</p>
            <span className={'badge badge-' + (rol === 'ENTRENADOR' ? 'confirmado' : 'pendiente')} style={{ marginTop: '4px' }}>
              {rol === 'ENTRENADOR' ? 'Entrenador' : 'Jugador'}
            </span>
          </div>
        </div>

        {mensaje && <p style={{ color: 'var(--accent)', fontWeight: '600', marginBottom: '16px' }}>{mensaje}</p>}

        <form onSubmit={handleGuardar}>
          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="form-group">
            <label>Nueva contraseña <span style={{ color: 'var(--texto-suave)', fontWeight: '400', fontSize: '0.8rem' }}>(dejar vacío para no cambiar)</span></label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Nueva contraseña" />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--texto-suave)', fontSize: '0.85rem', fontWeight: '500' }}>
                {showPass ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Perfil
