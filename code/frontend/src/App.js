import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Registro from './pages/registro'
import Perfil from './pages/perfil' // Adicione esta linha

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} /> {/* Adicione esta linha */}
      </Routes>
    </Router>
  )
}