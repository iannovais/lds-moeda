import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { jwtDecode } from "jwt-decode";
import Botao from "../components/Botao";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Titulo = styled.h1`
  color: #2b8a3e;
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

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
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
        <Titulo>Bem-vindo ao Sistema</Titulo>
        
        <BotoesContainer>
          <Botao onClick={() => navigate("/perfil")}>
            Meu Perfil
          </Botao>
          
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
          
          <Botao 
            tipo="secundario" 
            onClick={handleLogout}
            style={{ marginTop: '2rem' }}
          >
            Sair
          </Botao>
        </BotoesContainer>
      </Card>
    </Container>
  );
}