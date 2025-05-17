import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import Botao from '../components/Botao'
import CampoTexto from '../components/CampoTexto'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
`

const CardForm = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const Titulo = styled.h1`
  text-align: center;
  color: #2b8a3e;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`

export default function LoginPage() {
  const [credenciais, setCredenciais] = useState({
    email: '',
    senha: ''
  })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('http://localhost:3000/api/auth/login', credenciais)
      localStorage.setItem('token', data.token)
      navigate('/perfil')
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha na autenticação')
    }
  }

  const handleChange = (e) => {
    setCredenciais({
      ...credenciais,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Container>
      <CardForm>
        <Titulo>Acesse sua conta</Titulo>
        
        {erro && <div style={{ color: '#c92a2a', marginBottom: '1rem' }}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <CampoTexto
            label="Email"
            name="email"
            type="email"
            value={credenciais.email}
            onChange={handleChange}
            required
          />

          <CampoTexto
            label="Senha"
            name="senha"
            type="password"
            value={credenciais.senha}
            onChange={handleChange}
            required
          />

          <Botao 
            tipo="primario" 
            estilo={{ width: '100%', marginTop: '1.5rem' }}
          >
            Entrar
          </Botao>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          Novo usuário? {' '}
          <button
            onClick={() => navigate('/registro')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2b8a3e',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Criar conta
          </button>
        </div>
      </CardForm>
    </Container>
  )
}