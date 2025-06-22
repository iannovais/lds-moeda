import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Botao from "../components/Botao";
import CampoTexto from "../components/CampoTexto";
import { Mensagem, MensagemSucesso, MensagemErro } from "../components/MensagensEstilizadas";

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
  padding: 2rem 0;
`;

const CardForm = styled.div`
  width: 100%;
  max-width: 800px;
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

const Grupo = styled.div`
  margin-bottom: 1.5rem;
`;

export default function PerfilPage() {
  const [dados, setDados] = useState({
    nome: "",
    email: "",
    cpf: "",
    rg: "",
    endereco: "",
    curso: "",
    cnpj: "",
    departamento: "",
    id_instituicao: "",
    saldoMoedas: 0
  });

  const [instituicoes, setInstituicoes] = useState([]);
  const [loadingInstituicoes, setLoadingInstituicoes] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [idUsuario, setIdUsuario] = useState("");
  const navigate = useNavigate();

  // Carrega instituições quando o tipo de usuário for professor
  useEffect(() => {
    if (tipoUsuario === "professor") {
      carregarInstituicoes();
    }
  }, [tipoUsuario]);

  const carregarInstituicoes = async () => {
    setLoadingInstituicoes(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get('http://localhost:3000/api/instituicoes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstituicoes(data);
    } catch (error) {
      setErro('Erro ao carregar instituições');
    } finally {
      setLoadingInstituicoes(false);
    }
  };

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

        let endpoint;

        if (decoded.tipo === "aluno") {
          endpoint = "alunos";
        } else if (decoded.tipo === "empresa") {
          endpoint = "empresas";
        } else if (decoded.tipo === "professor") {
          endpoint = "professor";
        } else {
          throw new Error("Tipo de usuário desconhecido");
        }

        const { data: detalhes } = await axios.get(
          `http://localhost:3000/api/${endpoint}/${decoded.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setDados({
          ...usuario,
          ...detalhes
        });
      } catch (error) {
        setErro("Erro ao carregar dados do usuário");
        console.error("Erro ao carregar perfil:", error);
      }
    };

    carregarPerfil();
  }, [navigate]);

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

      let endpoint;
      let dadosEspecificos = {};

      if (tipoUsuario === "aluno") {
        endpoint = "alunos";
        dadosEspecificos = {
          cpf: dados.cpf,
          rg: dados.rg,
          endereco: dados.endereco,
          curso: dados.curso,
        };
      } else if (tipoUsuario === "empresa") {
        endpoint = "empresas";
        dadosEspecificos = {
          cnpj: dados.cnpj,
          endereco: dados.endereco,
        };
      } else if (tipoUsuario === "professor") {
        endpoint = "professor";
        dadosEspecificos = {
          cpf: dados.cpf,
          departamento: dados.departamento,
          id_instituicao: dados.id_instituicao,
        };
      }

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

  return (
    <Container>
      <CardForm>
        <Titulo>Bem-vindo, {dados.nome || "usuário"}!</Titulo>

        {sucesso && <MensagemSucesso>{sucesso}</MensagemSucesso>}
        {erro && <MensagemErro>{erro}</MensagemErro>}

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
                  {dados.saldoMoedas}
                </span>
              </div>
            </>
          ) : tipoUsuario === "professor" ? (
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
                label="Departamento"
                name="departamento"
                value={dados.departamento}
                onChange={handleChange}
                required
              />
              
              <Grupo>
                <label>Instituição de Ensino:</label>
                {loadingInstituicoes ? (
                  <p>Carregando instituições...</p>
                ) : (
                  <select
                    name="id_instituicao"
                    value={dados.id_instituicao}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #ced4da',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">-- Selecione --</option>
                    {instituicoes.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.nome}
                      </option>
                    ))}
                  </select>
                )}
              </Grupo>

              <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
                Saldo de Moedas:{" "}
                <span style={{ color: "#2b8a3e" }}>
                  {dados.saldoMoedas}
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

            {tipoUsuario === "empresa" && (
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
            )}
          </div>
        </form>
      </CardForm>
    </Container>
  );
}