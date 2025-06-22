import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Botao from "../components/Botao";
import CampoTexto from "../components/CampoTexto";
import FileUpload from "../components/Upload";
import Modal from "../components/Modal";
import { Mensagem, MensagemSucesso, MensagemErro } from "../components/MensagensEstilizadas";

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

const VantagensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const VantagemCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const VantagemImagem = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const VantagemTitulo = styled.h4`
  color: #2b8a3e;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const VantagemDescricao = styled.p`
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  flex-grow: 1;
`;

const VantagemPreco = styled.div`
  background: #f1f3f5;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  color: #2b8a3e;
  margin-top: auto;
`;

const VantagemData = styled.small`
  display: block;
  color: #868e96;
  margin-top: 0.5rem;
  font-size: 0.75rem;
`;

const FormVantagem = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
`;

const FormTitulo = styled.h3`
  color: #2b8a3e;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
`;

const BotaoResgatar = styled(Botao)`
  margin-top: 0.5rem;
  width: 100%;
`;

const ModalContent = styled.div`
  text-align: center;
  padding: 1.5rem;

  h3 {
    color: #2b8a3e;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .cupom {
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    color: #2b8a3e;
    background: #f1f3f5;
    padding: 1rem;
    border-radius: 5px;
    margin: 1rem 0;
    display: inline-block;
  }
`;

export default function VantagensPage() {
  const [vantagens, setVantagens] = useState([]);
  const [novaVantagem, setNovaVantagem] = useState({
    nome: "",
    descricao: "",
    custoMoedas: 0,
  });
  const [fotoArquivo, setFotoArquivo] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [saldoAluno, setSaldoAluno] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cupomResgate, setCupomResgate] = useState(null);
  const [vantagemResgatada, setVantagemResgatada] = useState(null);
  const [empresaResgate, setEmpresaResgate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    setTipoUsuario(decoded.tipo);

    if (decoded.tipo === "aluno") {
      carregarSaldoAluno(token, decoded.id);
    }
  }, [navigate]);

  const carregarSaldoAluno = async (token, alunoId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/alunos/${alunoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaldoAluno(response.data.saldoMoedas);
    } catch (error) {
      console.error("Erro ao carregar saldo do aluno:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const tipo = decoded.tipo;
    setTipoUsuario(tipo);

    const carregarVantagens = async () => {
      try {
        let endpoint = "/api/vantagens";
        if (tipo === "empresa") {
          endpoint = "/api/vantagens/minhas-vantagens";
        }

        const { data } = await axios.get(`http://localhost:3000${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVantagens(data);
      } catch (error) {
        console.error("Erro ao carregar vantagens:", error);
      }
    };

    carregarVantagens();
  }, [navigate]);

  const handleArquivoFoto = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setFotoArquivo(arquivo);
    }
  };

  const handleCriarVantagem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("nome", novaVantagem.nome);
      formData.append("descricao", novaVantagem.descricao);
      formData.append("custoMoedas", novaVantagem.custoMoedas);
      formData.append("foto", fotoArquivo);

      const { data } = await axios.post(
        "http://localhost:3000/api/vantagens",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setVantagens([...vantagens, data]);
      setNovaVantagem({ nome: "", descricao: "", custoMoedas: 0 });
      setFotoArquivo(null);
      setErro("");
      setSucesso("Vantagem criada com sucesso!");
      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      setErro(error.response?.data?.erro || "Erro ao criar vantagem");
      setTimeout(() => setErro(""), 3000);
    }
  };

  const handleResgatarVantagem = async (vantagemId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/vantagens/resgatar",
        { vantagemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualizar o saldo do aluno localmente
      setSaldoAluno(response.data.saldoAtual);

      // Mostrar modal com o cupom
      setCupomResgate(response.data.cupom);
      setVantagemResgatada(response.data.detalhesVantagem);
      setMostrarModal(true);

      // Atualizar a lista de vantagens para refletir que esta foi resgatada
      setVantagens(vantagens.map(v => 
        v.id === vantagemId ? { ...v, ativo: false } : v
      ));

      setSucesso("Vantagem resgatada com sucesso!");
      setTimeout(() => setSucesso(""), 5000);
    } catch (error) {
      console.error("Erro ao resgatar vantagem:", error);
      setErro(error.response?.data?.erro || "Erro ao resgatar vantagem");
      setTimeout(() => setErro(""), 3000);
    }
  };

  function obterUrlFoto(foto) {
    if (!foto) return "https://via.placeholder.com/300x160?text=Sem+Imagem";
    if (foto.startsWith("http")) {
      return foto;
    }
    const caminho = foto.startsWith("/") ? foto.substring(1) : foto;
    return `http://localhost:3000/${caminho}`;
  }

  const renderVantagens = () => (
    <div>
      <FormTitulo>
        {tipoUsuario === "empresa"
          ? "Minhas Vantagens"
          : "Vantagens Disponíveis"}
      </FormTitulo>

      {tipoUsuario === "aluno" && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
            Saldo disponível: <span style={{ color: "#2b8a3e" }}>{saldoAluno} moedas</span>
          </p>
        </div>
      )}

      {vantagens.length === 0 ? (
        <p style={{ color: "#868e96", textAlign: "center" }}>
          Nenhuma vantagem encontrada
        </p>
      ) : (
        <VantagensGrid>
          {vantagens.map((vantagem) => (
            <VantagemCard key={vantagem.id}>
              <VantagemImagem
                src={obterUrlFoto(vantagem.foto)}
                alt={vantagem.nome}
              />
              <VantagemTitulo>{vantagem.nome}</VantagemTitulo>
              <VantagemDescricao>{vantagem.descricao}</VantagemDescricao>
              <VantagemPreco>{vantagem.custoMoedas} moedas</VantagemPreco>
              
              {tipoUsuario === "empresa" && (
                <VantagemData>
                  Cadastrada em:{" "}
                  {new Date(vantagem.data_cadastro).toLocaleDateString()}
                </VantagemData>
              )}

              {tipoUsuario === "aluno" && vantagem.ativo && (
                <BotaoResgatar
                  tipo="primario"
                  onClick={() => handleResgatarVantagem(vantagem.id)}
                  disabled={saldoAluno < vantagem.custoMoedas}
                >
                  {saldoAluno < vantagem.custoMoedas 
                    ? "Saldo insuficiente" 
                    : "Resgatar"}
                </BotaoResgatar>
              )}

              {tipoUsuario === "aluno" && !vantagem.ativo && (
                <BotaoResgatar tipo="secundario" disabled>
                  Já resgatada
                </BotaoResgatar>
              )}
            </VantagemCard>
          ))}
        </VantagensGrid>
      )}
    </div>
  );

  return (
    <Container>
      <CardForm>
        <Titulo>
          {tipoUsuario === "empresa"
            ? "Minhas Vantagens"
            : "Vantagens Disponíveis"}
        </Titulo>

        {erro && <MensagemErro>{erro}</MensagemErro>}
        {sucesso && <MensagemSucesso>{sucesso}</MensagemSucesso>}

        {tipoUsuario === "empresa" && (
          <FormVantagem>
            <FormTitulo>Cadastrar Nova Vantagem</FormTitulo>
            <form onSubmit={handleCriarVantagem} encType="multipart/form-data">
              <CampoTexto
                label="Nome"
                name="nome"
                value={novaVantagem.nome}
                onChange={(e) =>
                  setNovaVantagem({ ...novaVantagem, nome: e.target.value })
                }
                required
              />
              <CampoTexto
                label="Descrição"
                name="descricao"
                value={novaVantagem.descricao}
                onChange={(e) =>
                  setNovaVantagem({
                    ...novaVantagem,
                    descricao: e.target.value,
                  })
                }
                required
              />
              <CampoTexto
                label="Custo em Moedas"
                name="custoMoedas"
                type="number"
                value={novaVantagem.custoMoedas}
                onChange={(e) =>
                  setNovaVantagem({
                    ...novaVantagem,
                    custoMoedas: parseFloat(e.target.value),
                  })
                }
                min="1"
                step="0.01"
                required
              />
              <label>Foto</label>
              <FileUpload
                label="Foto da Vantagem"
                accept="image/*"
                onChange={handleArquivoFoto}
                preview={fotoArquivo}
                required 
              />

              <Botao tipo="primario" style={{ marginTop: "1rem" }}>
                Cadastrar Vantagem
              </Botao>
            </form>
          </FormVantagem>
        )}

        {renderVantagens()}
      </CardForm>

      <Modal mostrar={mostrarModal} aoFechar={() => setMostrarModal(false)}>
        <ModalContent>
          <h3>Vantagem Resgatada com Sucesso!</h3>
          <p>
            Você resgatou a vantagem <strong>{vantagemResgatada?.nome}</strong> da empresa{" "}
            <strong>{vantagemResgatada?.empresa}</strong>.
          </p>
          <p>Apresente o cupom abaixo no local indicado para usufruir de seu benefício:</p>
          <div className="cupom">{cupomResgate}</div>
          <p>Este cupom é válido por 7 dias a partir de hoje.</p>
          <Botao
            tipo="primario"
            onClick={() => setMostrarModal(false)}
            style={{ marginTop: "1rem" }}
          >
            Entendi
          </Botao>
        </ModalContent>
      </Modal>
    </Container>
  );
}