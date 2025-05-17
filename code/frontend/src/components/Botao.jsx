import styled from "styled-components"

const ComponenteBotao = styled.button`
  background-color: var(--verde-principal);
  color: var(--branco);
  padding: 11px 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  transition: background-color 0.3s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: var(--verde-hover);
  }

  &:disabled {
    background-color: var(--verde-disabled);
    cursor: not-allowed;
  }
`

const Botao = ({ type = "button", children, onClick, disabled }) => {
  return (
    <ComponenteBotao type={type} onClick={onClick} disabled={disabled}>
      {children}
    </ComponenteBotao>
  )
}

export default Botao
