import styled from "styled-components";

export const Mensagem = styled.div`
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

export const MensagemSucesso = styled(Mensagem)`
  background-color: #d4edda;
  color: #155724;
`;

export const MensagemErro = styled(Mensagem)`
  background-color: #f8d7da;
  color: #721c24;
`;