import { Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './api'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Equipo from './pages/Equipo'
import ConvocatoriaDetalle from './pages/ConvocatoriaDetalle'
import Perfil from './pages/Perfil'

function PrivateRoute({ children }) {
  return getUser() ? children : <Navigate to="/login" />
}

function App() {
  return (
    <>
      {getUser() && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/equipo/:id" element={<PrivateRoute><Equipo /></PrivateRoute>} />
        <Route path="/convocatoria/:id" element={<PrivateRoute><ConvocatoriaDetalle /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
