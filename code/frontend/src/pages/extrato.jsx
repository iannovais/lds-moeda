import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import styled from "styled-components";
import Botao from "../components/Botao";
import CampoTexto from "../components/CampoTexto";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
`;

const Titulo = styled.h1`
  text-align: center;
  color: #2b8a3e;
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const Abas = styled.div`
  display: flex;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
`;

const Aba = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.ativa ? "#f1f3f5" : "transparent")};
  border: none;
  border-bottom: 3px solid ${(props) => (props.ativa ? "#2b8a3e" : "transparent")};
  cursor: pointer;
  font-weight: 600;
  color: ${(props) => (props.ativa ? "#2b8a3e" : "#495057")};
  transition: all 0.3s ease;

  &:hover {
    background: #f1f3f5;
  }
`;

const ConteudoAba = styled.div`
  padding: 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Mensagem = styled.div`
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const MensagemSucesso = styled(Mensagem)`
  background-color: #d4edda;
  color: #155724;
`;

const MensagemErro = styled(Mensagem)`
  background-color: #f8d7da;
  color: #721c24;
`;

const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Cabecalho = styled.thead`
  background-color: #2b8a3e;
  color: white;
`;

const LinhaCabecalho = styled.tr``;

const CelulaCabecalho = styled.th`
  padding: 1rem;
  text-align: left;
`;

const Linha = styled.tr`
  &:nth-child(even) {
    background-color: #f1f3f5;
  }
`;

const Celula = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
`;

const CelulaCentro = styled(Celula)`
  text-align: center;
`;

const BadgeTipo = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
`;

const BadgeEnvio = styled(BadgeTipo)`
  background-color: #ffe3e3;
  color: #c92a2a;
`;

const BadgeRecebimento = styled(BadgeTipo)`
  background-color: #d3f9d8;
  color: #2b8a3e;
`;

export default function ExtratoPage() {
  const [abaAtiva, setAbaAtiva] = useState("enviar");
  const [alunos, setAlunos] = useState([]);
  const [dadosEnvio, setDadosEnvio] = useState({
    alunoId: "",
    valor: "",
    mensagem: ""
  });
  const [transacoes, setTransacoes] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [nomesUsuarios, setNomesUsuarios] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const carregarDados = async () => {
      try {
        const decoded = jwtDecode(token);
        setTipoUsuario(decoded.tipo);

        // Verificar se o tipo de usuário é válido (apenas professor ou aluno)
        if (decoded.tipo !== "professor" && decoded.tipo !== "aluno") {
          navigate("/login");
          return;
        }

        let endpointSaldo;
        if (decoded.tipo === "professor") {
          endpointSaldo = `http://localhost:3000/api/professor/${decoded.id}`;
        } else {
          endpointSaldo = `http://localhost:3000/api/alunos/${decoded.id}`;
        }

        const responseSaldo = await axios.get(
          endpointSaldo,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaldo(responseSaldo.data.saldoMoedas);

        if (decoded.tipo === "professor" && abaAtiva === "enviar") {
          const responseAlunos = await axios.get(
            "http://localhost:3000/api/alunos",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const alunosComNomes = await Promise.all(
            responseAlunos.data.map(async (aluno) => {
              const responseUsuario = await axios.get(
                `http://localhost:3000/api/usuarios/${aluno.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return {
                ...aluno,
                nome: responseUsuario.data.nome
              };
            })
          );

          setAlunos(alunosComNomes);
        }

        let endpointTransacoes;
        if (decoded.tipo === "professor") {
          endpointTransacoes = "http://localhost:3000/api/professor/extrato";
        } else {
          endpointTransacoes = `http://localhost:3000/api/alunos/extrato`;
        }

        const responseTransacoes = await axios.get(
          endpointTransacoes,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransacoes(responseTransacoes.data);

        const idsUsuarios = new Set();
        responseTransacoes.data.forEach(transacao => {
          if (transacao.remetente_id) idsUsuarios.add(transacao.remetente_id);
          if (transacao.destinatario_id) idsUsuarios.add(transacao.destinatario_id);
        });

        const nomes = {};
        for (const id of idsUsuarios) {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/usuarios/${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            nomes[id] = response.data.nome;
          } catch (error) {
            console.error(`Erro ao buscar usuário ${id}:`, error);
            nomes[id] = `Usuário ${id}`;
          }
        }
        setNomesUsuarios(nomes);

        setCarregando(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setErro("Erro ao carregar dados");
        setCarregando(false);
      }
    };

    carregarDados();
  }, [navigate, abaAtiva]);

  const handleChange = (e) => {
    setDadosEnvio({
      ...dadosEnvio,
      [e.target.name]: e.target.value,
    });
  };

  const handleEnviarMoedas = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);

      const payload = {
        alunoId: dadosEnvio.alunoId,
        valor: parseInt(dadosEnvio.valor),
        mensagem: dadosEnvio.mensagem
      };

      await axios.post(
        "http://localhost:3000/api/professor/enviar-moedas",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSaldo(saldo - payload.valor);
      setSucesso("Moedas enviadas com sucesso!");
      setDadosEnvio({ alunoId: "", valor: "", mensagem: "" });

      setTimeout(() => setSucesso(""), 3000);
    } catch (error) {
      console.error("Erro ao enviar moedas:", error.response?.data || error.message);
      setErro(error.response?.data?.erro || "Erro ao enviar moedas");
      setTimeout(() => setErro(""), 3000);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarTipoTransacao = (tipo, usuario) => {
    if (usuario === "aluno") {
      switch (tipo) {
        case "envio_moedas":
          return "Recebimento de Moedas";
        case "resgate_vantagem":
          return "Resgate de Vantagem";
        default:
          return tipo;
      }
    } else {
      switch (tipo) {
        case "envio_moedas":
          return "Envio de Moedas";
        case "recarga_instituicao":
          return "Recarga Institucional";
        case "resgate_vantagem":
          return "Resgate de Vantagem";
        default:
          return tipo;
      }
    }
  };

  const renderizarBadgeTipo = (tipo, usuario) => {
    const tipoFormatado = formatarTipoTransacao(tipo, usuario);

    // Nova lógica de cores baseada no fluxo de moedas
    if (usuario === "aluno") {
      // Aluno:
      // - Recebimento: Verde
      // - Saída: Vermelho
      if (tipo === "envio_moedas") {
        return <BadgeRecebimento>{tipoFormatado}</BadgeRecebimento>;
      } else {
        return <BadgeEnvio>{tipoFormatado}</BadgeEnvio>;
      }
    } else {
      // Professor:
      // - Saída: Vermelho
      // - Entrada: Verde
      if (tipo === "envio_moedas" || tipo === "resgate_vantagem") {
        return <BadgeEnvio>{tipoFormatado}</BadgeEnvio>;
      } else {
        return <BadgeRecebimento>{tipoFormatado}</BadgeRecebimento>;
      }
    }
  };

  const renderProfessor = () => (
    <>
      <Abas>
        <Aba
          ativa={abaAtiva === "enviar"}
          onClick={() => setAbaAtiva("enviar")}
        >
          Enviar Moedas
        </Aba>
        <Aba
          ativa={abaAtiva === "extrato"}
          onClick={() => setAbaAtiva("extrato")}
        >
          Extrato
        </Aba>
      </Abas>

      <ConteudoAba>
        {abaAtiva === "enviar" ? (
          <>
            {sucesso && <MensagemSucesso>{sucesso}</MensagemSucesso>}
            {erro && <MensagemErro>{erro}</MensagemErro>}

            <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                Saldo disponível: <span style={{ color: "#2b8a3e" }}>{saldo} moedas</span>
              </p>
            </div>

            <form onSubmit={handleEnviarMoedas}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label>Aluno</label>
                <select
                  name="alunoId"
                  value={dadosEnvio.alunoId}
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
                  <option value="">Selecione um aluno</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome}
                    </option>
                  ))}
                </select>
              </div>

              <CampoTexto
                label="Valor"
                name="valor"
                value={dadosEnvio.valor}
                onChange={handleChange}
                required
                type="number"
                min="1"
                max={saldo}
              />

              <CampoTexto
                label="Mensagem"
                name="mensagem"
                value={dadosEnvio.mensagem}
                onChange={handleChange}
                required
                multiline
                rows={3}
                placeholder="Motivo do envio de moedas..."
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "2rem" }}>
                <Botao style={{ width: "100%" }}>Enviar Moedas</Botao>
              </div>
            </form>
          </>
        ) : (
          renderExtrato("professor")
        )}
      </ConteudoAba>
    </>
  );

  const renderAluno = () => (
    <ConteudoAba>
      {sucesso && <MensagemSucesso>{sucesso}</MensagemSucesso>}
      {erro && <MensagemErro>{erro}</MensagemErro>}

      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          Saldo atual: <span style={{ color: "#2b8a3e" }}>{saldo} moedas</span>
        </p>
      </div>

      {renderExtrato("aluno")}
    </ConteudoAba>
  );

  // Renderizar extrato
const renderExtrato = (usuario) => {
  if (carregando) {
    return <p style={{ textAlign: "center" }}>Carregando extrato...</p>;
  }

  if (transacoes.length === 0) {
    return <p style={{ textAlign: "center" }}>Nenhuma transação encontrada</p>;
  }

  return (
    <Tabela>
      <Cabecalho>
        <LinhaCabecalho>
          <CelulaCabecalho>Data</CelulaCabecalho>
          <CelulaCabecalho>Tipo</CelulaCabecalho>
          <CelulaCabecalho>Valor</CelulaCabecalho>
          <CelulaCabecalho>Mensagem</CelulaCabecalho>
          <CelulaCabecalho>{usuario === "aluno" ? "Origem/Destino" : "Destinatário"}</CelulaCabecalho>
        </LinhaCabecalho>
      </Cabecalho>
      <tbody>
        {transacoes.map((transacao) => {
          let origemDestino = "";
          let valorFormatado = "";
          let corValor = "";

          if (usuario === "aluno") {
            if (transacao.tipo === "envio_moedas") {
              // Recebimento de moedas do professor
              origemDestino = `De: ${nomesUsuarios[transacao.remetente_id] || `Professor ${transacao.remetente_id}`}`;
              valorFormatado = `+${transacao.valorMoedas}`;
              corValor = "#2b8a3e";
            } else if (transacao.tipo === "resgate_vantagem") {
              // Resgate de vantagem (pagamento para empresa)
              origemDestino = `Para: ${nomesUsuarios[transacao.destinatario_id] || `Empresa ${transacao.destinatario_id}`}`;
              valorFormatado = `-${transacao.valorMoedas}`;
              corValor = "#c92a2a";
            }
          } else {
            // Professor
            if (transacao.tipo === "envio_moedas") {
              origemDestino = `Para: ${nomesUsuarios[transacao.destinatario_id] || `Aluno ${transacao.destinatario_id}`}`;
              valorFormatado = `-${transacao.valorMoedas}`;
              corValor = "#c92a2a";
            } else if (transacao.tipo === "recarga_instituicao") {
              origemDestino = "Instituição";
              valorFormatado = `+${transacao.valorMoedas}`;
              corValor = "#2b8a3e";
            }
          }

          return (
            <Linha key={transacao.id}>
              <Celula>{formatarData(transacao.data)}</Celula>
              <Celula>
                {renderizarBadgeTipo(transacao.tipo, usuario)}
              </Celula>
              <CelulaCentro>
                <span style={{
                  color: corValor,
                  fontWeight: "bold"
                }}>
                  {valorFormatado}
                </span>
              </CelulaCentro>
              <Celula>{transacao.mensagem || "-"}</Celula>
              <Celula>{origemDestino}</Celula>
            </Linha>
          );
        })}
      </tbody>
    </Tabela>
  );
};

  return (
    <Container>
      <Titulo>
        {tipoUsuario === "professor"
          ? "Área do Professor"
          : "Extrato do Aluno"}
      </Titulo>

      {tipoUsuario === "professor" && renderProfessor()}
      {tipoUsuario === "aluno" && renderAluno()}
    </Container>
  );
}