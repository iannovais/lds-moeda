// src/components/Botao.js
import styled from "styled-components"

const StyledButton = styled.button`
  background-color: var(--verde-principal);
  color: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #28b463;
  }
`

export default function Botao({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}
