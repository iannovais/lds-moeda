import styled from "styled-components"

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  color: #333;

  &:focus {
    border-color: var(--verde-principal);
    outline: none;
    background-color: #fff;
  }
`

export default function CampoTexto({ label, ...props }) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input {...props} />
    </Wrapper>
  )
}