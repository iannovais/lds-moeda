import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 14px;
  color: var(--cinza-escuro);
`

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--cinza-claro);
  border-radius: 5px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--dourado);
    box-shadow: 0 0 0 2px rgba(218, 165, 32, 0.2);
  }
`

const CampoTexto = ({ label, ...props }) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Input {...props} />
    </Container>
  )
}

export default CampoTexto
