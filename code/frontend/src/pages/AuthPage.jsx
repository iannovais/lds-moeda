
import { useState } from 'react'
import styled from 'styled-components'
import Login from '../components/Login'
import Registro from '../components/Registro'

const ContainerPagina = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cinza-fundo);
`

const Alternador = styled.div`
  text-align: center;
  margin-top: 1.5rem;

  button {
    background: none;
    border: none;
    color: var(--verde-principal);
    cursor: pointer;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 128, 0, 0.1);
    }
  }
`

export default function AuthPage() {
  const [modoLogin, setModoLogin] = useState(true)

  return (
    <ContainerPagina>
      <div>
        {modoLogin ? <Login /> : <Registro />}
        
        <Alternador>
          {modoLogin ? (
            <>
              Não tem uma conta?{' '}
              <button onClick={() => setModoLogin(false)}>
                Registre-se
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <button onClick={() => setModoLogin(true)}>
                Faça login
              </button>
            </>
          )}
        </Alternador>
      </div>
    </ContainerPagina>
  )
}