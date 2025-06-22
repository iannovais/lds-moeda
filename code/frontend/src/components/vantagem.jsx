// components/Vantagem.jsx
import styled from "styled-components";
import Botao from "./Botao";

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

const BotaoResgatar = styled(Botao)`
  margin-top: 0.5rem;
  width: 100%;
`;

export default function Vantagem({
  vantagem,
  tipoUsuario,
  saldoAluno,
  onResgatar,
}) {
  function obterUrlFoto(foto) {
    if (!foto) return "https://via.placeholder.com/300x160?text=Sem+Imagem";
    if (foto.startsWith("http")) {
      return foto;
    }
    const caminho = foto.startsWith("/") ? foto.substring(1) : foto;
    return `http://localhost:3000/${caminho}`;
  }

  return (
    <VantagemCard>
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
          onClick={() => onResgatar(vantagem.id)}
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
  );
}