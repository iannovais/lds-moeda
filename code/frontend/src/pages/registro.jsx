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
  max-width: 500px;
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

const Grupo = styled.div`
  margin-bottom: 1.5rem;
`

export default function RegistroPage() {
  const [tipoUsuario, setTipoUsuario] = useState('aluno')
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    rg: '',
    endereco: '',
    curso: '',
    cnpj: ''
  })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Construir payload específico
    const payload = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      tipo: tipoUsuario
    }

    if (tipoUsuario === 'aluno') {
      payload.cpf = dados.cpf
      payload.rg = dados.rg
      payload.endereco = dados.endereco
      payload.curso = dados.curso
    } else {
      payload.cnpj = dados.cnpj
      payload.endereco = dados.endereco
    }

    try {
      await axios.post('http://localhost:3000/api/auth/registrar', payload)
      navigate('/login')
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro no registro')
    }
  }

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Container>
      <CardForm>
        <Titulo>Criar nova conta</Titulo>
        
        {erro && <div style={{ color: '#c92a2a', marginBottom: '1rem' }}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <Grupo>
            <label>Tipo de conta:</label>
            <select
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid #ced4da',
                fontSize: '1rem'
              }}
            >
              <option value="aluno">Aluno</option>
              <option value="empresa">Empresa</option>
            </select>
          </Grupo>

          <CampoTexto
            label="Nome completo"
            name="nome"
            value={dados.nome}
            onChange={handleChange}
            required
          />

          <CampoTexto
            label="Email"
            type="email"
            name="email"
            value={dados.email}
            onChange={handleChange}
            required
          />

          <CampoTexto
            label="Senha"
            type="password"
            name="senha"
            value={dados.senha}
            onChange={handleChange}
            required
          />

          {tipoUsuario === 'aluno' ? (
            <>
              <CampoTexto
                label="CPF"
                name="cpf"
                value={dados.cpf}
                onChange={handleChange}
                required
                mask="999.999.999-99"
              />

              <CampoTexto
                label="RG"
                name="rg"
                value={dados.rg}
                onChange={handleChange}
                required
                mask="99.999.999-9"
              />

              <CampoTexto
                label="Endereço completo"
                name="endereco"
                value={dados.endereco}
                onChange={handleChange}
                required
              />

              <CampoTexto
                label="Curso"
                name="curso"
                value={dados.curso}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <CampoTexto
                label="CNPJ"
                name="cnpj"
                value={dados.cnpj}
                onChange={handleChange}
                required
                mask="99.999.999/9999-99"
              />

              <CampoTexto
                label="Endereço completo"
                name="endereco"
                value={dados.endereco}
                onChange={handleChange}
                required
              />
            </>
          )}

          <Botao 
            tipo="primario" 
            estilo={{ width: '100%', marginTop: '2rem' }}
          >
            Criar conta
          </Botao>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          Já tem uma conta? {' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#2b8a3e',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'underline'
            }}
          >
            Fazer login
          </button>
        </div>
      </CardForm>
    </Container>
  )
}