import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Registro from './pages/registro'
import Perfil from './pages/perfil'
import HomePage from './pages/home'
import VantagensPage from './pages/vantagens'
import Extrato from "./pages/extrato";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/vantagens" element={<VantagensPage />} />
        <Route path="/extrato" element={<Extrato />} />
      </Routes>
    </Router>
  )
}