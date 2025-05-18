import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styled from 'styled-components';
import Botao from '../components/Botao';
import CampoTexto from '../components/CampoTexto';

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

export default function PerfilPage() {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    cpf: '',
    rg: '',
    endereco: '',
    curso: '',
    saldomoedas: 0, // Corrigido: estava "saldoMoedas"
    cnpj: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setIdUsuario(decoded.id);
        setTipoUsuario(decoded.tipo);

        const { data: usuario } = await axios.get(`http://localhost:3000/api/usuarios/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const endpoint = decoded.tipo === 'aluno' ? 'alunos' : 'empresas';
        const { data: detalhes } = await axios.get(`http://localhost:3000/api/${endpoint}/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDados({ ...usuario, ...detalhes });
      } catch (error) {
        setErro('Erro ao carregar dados do usuário');
        console.error('Erro ao carregar perfil:', error);
      }
    };

    carregarPerfil();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `http://localhost:3000/api/usuarios/${idUsuario}`,
        { nome: dados.nome, email: dados.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const endpoint = tipoUsuario === 'aluno' ? 'alunos' : 'empresas';

      const dadosEspecificos = tipoUsuario === 'aluno' ? {
        cpf: dados.cpf,
        rg: dados.rg,
        endereco: dados.endereco,
        curso: dados.curso,
        saldomoedas: dados.saldomoedas ?? 0 // Corrigido aqui também
      } : {
        cnpj: dados.cnpj,
        endereco: dados.endereco
      };

      console.log('Enviando dados PUT para', endpoint, ':', dadosEspecificos);

      await axios.put(
        `http://localhost:3000/api/${endpoint}/${idUsuario}`,
        dadosEspecificos,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSucesso('Dados atualizados com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error.response?.data || error.message);
      setErro('Erro ao atualizar dados');
    }
  };

  const handleChange = (e) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value
    });
  };

return (
  <Container>
    <CardForm>
      <Titulo>Bem-vindo, {dados.nome || 'usuário'}!</Titulo>

      {sucesso && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '0.75rem',
          borderRadius: '5px',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
          {sucesso}
        </div>
      )}

      {erro && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '5px',
          marginBottom: '1rem',
          fontWeight: '500'
        }}>
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

        {tipoUsuario === 'aluno' ? (
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
            <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
              Saldo de Moedas: <span style={{ color: '#2b8a3e' }}>{dados.saldoMoedas ?? 0}</span>
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

        <Botao
          tipo="primario"
          estilo={{ width: '100%', marginTop: '2rem' }}
        >
          Salvar Alterações
        </Botao>
      </form>
    </CardForm>
  </Container>
);
}
