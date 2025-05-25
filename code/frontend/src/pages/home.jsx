import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { jwtDecode } from "jwt-decode";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 3rem 2rem;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
  animation: ${fadeIn} 1.5s ease-out;
`;

const Titulo = styled.h1`
  font-size: 2.5rem;
  color: #2b8a3e;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const Subtitulo = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const BotoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
`;

const Botao = styled.button`
  padding: 0.9rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.tipo === "secundario" ? "#2b8a3e" : "#fff")};
  background: ${(props) => (props.tipo === "secundario" ? "#fff" : "#2b8a3e")};
  border: 2px solid #2b8a3e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${(props) => (props.tipo === "secundario" ? "#f0f0f0" : "#256d32")};
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getUserType = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.tipo;
  };

  const tipoUsuario = getUserType();

  return (
    <Container>
      <Card>
        <Titulo>Bem-vindo!</Titulo>
        <Subtitulo>Escolha uma opção para continuar:</Subtitulo>

        <BotoesContainer>
          <Botao onClick={() => navigate("/perfil")}>Meu Perfil</Botao>

          {tipoUsuario === "empresa" && (
            <Botao onClick={() => navigate("/vantagens")}>
              Gerenciar Vantagens
            </Botao>
          )}

          {tipoUsuario === "aluno" && (
            <Botao onClick={() => navigate("/vantagens")}>
              Ver Vantagens
            </Botao>
          )}

          <Botao tipo="secundario" onClick={handleLogout}>
            Sair
          </Botao>
        </BotoesContainer>
      </Card>
    </Container>
  );
}
