import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Botao from "../components/Botao";
import CampoTexto from "../components/CampoTexto";

const SectionTitulo = styled.h2`
  font-size: 1.2rem;
  color: #495057;
  margin: 1.5rem 0 1rem;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
`;

const CardForm = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Titulo = styled.h1`
  text-align: center;
  color: #2b8a3e;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const SectionVantagens = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
`;

const VantagemCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const FormVantagem = styled.div`
  background: #f1f3f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

export default function PerfilPage() {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    cpf: "",
    rg: "",
    endereco: "",
    curso: "",
    saldomoedas: 0,
    cnpj: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const [vantagens, setVantagens] = useState([]);
  const [novaVantagem, setNovaVantagem] = useState({
    nome: "",
    descricao: "",
    foto: "",
    custoMoedas: 0
  });
  const [erroVantagem, setErroVantagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setIdUsuario(decoded.id);
        setTipoUsuario(decoded.tipo);

        const { data: usuario } = await axios.get(
          `http://localhost:3000/api/usuarios/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const endpoint = decoded.tipo === "aluno" ? "alunos" : "empresas";
        const { data: detalhes } = await axios.get(
          `http://localhost:3000/api/${endpoint}/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDados({ ...usuario, ...detalhes });
      } catch (error) {
        setErro("Erro ao carregar dados do usuário");
        console.error("Erro ao carregar perfil:", error);
      }
    };

    carregarPerfil();
  }, [navigate]);

  useEffect(() => {
    const carregarVantagens = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        let endpoint = "/api/vantagens";
        if (tipoUsuario === "empresa") {
          endpoint = "/api/vantagens/minhas-vantagens";
        }

        const { data } = await axios.get(`http://localhost:3000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setVantagens(data);
      } catch (error) {
        console.error("Erro ao carregar vantagens:", error);
      }
    };

    if (tipoUsuario) {
      carregarVantagens();
    }
  }, [tipoUsuario]);

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/usuarios/${idUsuario}`,
        { nome: dados.nome, email: dados.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const endpoint = tipoUsuario === "aluno" ? "alunos" : "empresas";

      const dadosEspecificos =
        tipoUsuario === "aluno"
          ? {
              cpf: dados.cpf,
              rg: dados.rg,
              endereco: dados.endereco,
              curso: dados.curso,
              saldomoedas: dados.saldomoedas ?? 0,
            }
          : {
              cnpj: dados.cnpj,
              endereco: dados.endereco,
            };

      await axios.put(
        `http://localhost:3000/api/${endpoint}/${idUsuario}`,
        dadosEspecificos,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSucesso("Dados atualizados com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao atualizar dados:", error.response?.data || error.message);
      setErro("Erro ao atualizar dados");
      setTimeout(() => setErro(""), 3000);
    }
  };

  const handleExcluirConta = async () => {
    const confirmacao = window.confirm(
      "Tem certeza que deseja excluir sua conta? Esta ação é irreversível!"
    );
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/usuarios/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao excluir conta:", error.response?.data || error.message);
      setErro("Erro ao excluir conta");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCriarVantagem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3000/api/vantagens",
        novaVantagem,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setVantagens([...vantagens, data]);
      setNovaVantagem({ nome: "", descricao: "", foto: "", custoMoedas: 0 });
      setErroVantagem("");
    } catch (error) {
      setErroVantagem(error.response?.data?.erro || "Erro ao criar vantagem");
    }
  };

  const renderVantagens = () => (
    <div>
      <h3>{tipoUsuario === "empresa" ? "Minhas Vantagens" : "Vantagens Disponíveis"}</h3>
      {vantagens.length === 0 ? (
        <p>Nenhuma vantagem encontrada</p>
      ) : (
        vantagens.map((vantagem) => (
          <VantagemCard key={vantagem.id}>
            {vantagem.foto && (
              <img 
                src={vantagem.foto} 
                alt={vantagem.nome} 
                style={{ maxWidth: "100px", marginBottom: "1rem" }}
              />
            )}
            <h4>{vantagem.nome}</h4>
            <p>{vantagem.descricao}</p>
            <div>Custo: {vantagem.custoMoedas} moedas</div>
            {tipoUsuario === "empresa" && (
              <small>Cadastrada em: {new Date(vantagem.data_cadastro).toLocaleDateString()}</small>
            )}
          </VantagemCard>
        ))
      )}
    </div>
  );

  return (
    <Container>
      <CardForm>
        <Titulo>Bem-vindo, {dados.nome || "usuário"}!</Titulo>

        {sucesso && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "0.75rem",
              borderRadius: "5px",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            {sucesso}
          </div>
        )}

        {erro && (
          <div
            style={{
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.75rem",
              borderRadius: "5px",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <SectionTitulo>Dados de Acesso</SectionTitulo>

          <CampoTexto
            label="Nome"
            name="nome"
            value={dados.nome}
            onChange={handleChange}
            required
          />

          <CampoTexto
            label="Email"
            type="email"
            name="email"
            value={dados.email}
            onChange={handleChange}
            required
          />

          <SectionTitulo>Informações Pessoais</SectionTitulo>

          {tipoUsuario === "aluno" ? (
            <>
              <CampoTexto
                label="CPF"
                name="cpf"
                value={dados.cpf}
                onChange={handleChange}
                mask="999.999.999-99"
                required
              />
              <CampoTexto
                label="RG"
                name="rg"
                value={dados.rg}
                onChange={handleChange}
                mask="99.999.999-9"
                required
              />
              <CampoTexto
                label="Endereço"
                name="endereco"
                value={dados.endereco}
                onChange={handleChange}
                required
              />
              <CampoTexto
                label="Curso"
                name="curso"
                value={dados.curso}
                onChange={handleChange}
                required
              />
              <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
                Saldo de Moedas:{" "}
                <span style={{ color: "#2b8a3e" }}>
                  {dados.saldomoedas ?? 0}
                </span>
              </div>
            </>
          ) : (
            <>
              <CampoTexto
                label="CNPJ"
                name="cnpj"
                value={dados.cnpj}
                onChange={handleChange}
                mask="99.999.999/9999-99"
                required
              />
              <CampoTexto
                label="Endereço"
                name="endereco"
                value={dados.endereco}
                onChange={handleChange}
                required
              />
            </>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <Botao style={{ width: "100%", marginTop: "2rem" }}>
              Salvar Alterações
            </Botao>

            <Botao
              tipo="perigo"
              style={{
                width: "100%",
                marginTop: "2rem",
                backgroundColor: "#c92a2a",
              }}
              onClick={handleExcluirConta}
            >
              Excluir Conta
            </Botao>

            <Botao
              tipo="secundario"
              style={{
                width: "100%",
                marginTop: "2rem",
                backgroundColor: "#868e96",
              }}
              onClick={handleLogout}
            >
              Deslogar
            </Botao>
          </div>
        </form>

        <SectionVantagens>
          {erroVantagem && (
            <div style={{ color: "#c92a2a", marginBottom: "1rem" }}>{erroVantagem}</div>
          )}

          {tipoUsuario === "empresa" && (
            <FormVantagem>
              <h3>Cadastrar Nova Vantagem</h3>
              <form onSubmit={handleCriarVantagem}>
                <CampoTexto
                  label="Nome"
                  name="nome"
                  value={novaVantagem.nome}
                  onChange={(e) => setNovaVantagem({...novaVantagem, nome: e.target.value})}
                  required
                />
                <CampoTexto
                  label="Descrição"
                  name="descricao"
                  value={novaVantagem.descricao}
                  onChange={(e) => setNovaVantagem({...novaVantagem, descricao: e.target.value})}
                  required
                />
                <CampoTexto
                  label="URL da Foto"
                  name="foto"
                  type="url"
                  value={novaVantagem.foto}
                  onChange={(e) => setNovaVantagem({...novaVantagem, foto: e.target.value})}
                />
                <CampoTexto
                  label="Custo em Moedas"
                  name="custoMoedas"
                  type="number"
                  value={novaVantagem.custoMoedas}
                  onChange={(e) => setNovaVantagem({
                    ...novaVantagem, 
                    custoMoedas: parseFloat(e.target.value)
                  })}
                  min="0"
                  step="0.01"
                  required
                />
                <Botao
                  tipo="primario"
                  estilo={{ marginTop: "1rem" }}
                >
                  Cadastrar Vantagem
                </Botao>
              </form>
            </FormVantagem>
          )}

          {renderVantagens()}
        </SectionVantagens>
      </CardForm>
    </Container>
  );
}