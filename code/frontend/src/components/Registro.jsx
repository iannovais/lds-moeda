import styled from "styled-components"
import Botao from "./Botao"
import CampoTexto from "./CampoTexto"

const Form = styled.form`
  max-width: 360px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
`

const Titulo = styled.h2`
  text-align: center;
  color: var(--verde-principal);
  margin-bottom: 1.5rem;
`

export default function Registro() {
  return (
    <Form>
      <Titulo>Registrar</Titulo>
      <CampoTexto label="Email" type="email" name="email" required />
      <CampoTexto label="Senha" type="password" name="senha" required />
      <Botao type="submit" style={{ width: "100%", marginTop: "1rem" }}>
        Registrar
      </Botao>
    </Form>
  )
}
