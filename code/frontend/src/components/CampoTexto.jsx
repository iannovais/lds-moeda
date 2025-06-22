import styled from "styled-components"

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--cinza-texto);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid var(--cinza-claro);
  background-color: #f7f7f7;
  color: var(--cinza-texto);

  &:focus {
    border-color: var(--verde-principal);
    outline: none;
    background-color: var(--branco);
  }
`;

export default function CampoTexto({ label, ...props }) {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Input {...props} />
    </Wrapper>
  )
}