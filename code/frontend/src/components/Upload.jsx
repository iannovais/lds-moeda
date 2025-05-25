import styled from "styled-components"
import { useState } from "react";

const CampoArquivoContainer = styled.div`
  margin: 1rem 0;
`;

const CampoArquivoLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 500;
  font-size: 0.875rem;
`;

const CampoArquivoCustom = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.5rem;
  background-color: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #868e96;
  }

  &:focus-within {
    border-color: #2b8a3e;
    box-shadow: 0 0 0 0.2rem rgba(43, 138, 62, 0.25);
  }
`;

const CampoArquivoInput = styled.input.attrs({ type: "file" })`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  left: 0;
  top: 0;
`;

const CampoArquivoTexto = styled.span`
  padding: 0.375rem 0.75rem;
  background-color: #f1f3f5;
  border-radius: 4px;
  color: #495057;
  margin-right: 0.75rem;
  font-size: 0.875rem;
`;

const CampoArquivoNome = styled.span`
  font-size: 0.875rem;
  color: #868e96;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

const PreviewImagem = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  display: block;
`;

const FileUpload = ({ label, accept, onChange, preview }) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
    onChange(e);
  };

  return (
    <CampoArquivoContainer>
      <CampoArquivoLabel>{label}</CampoArquivoLabel>
      <CampoArquivoCustom>
        <CampoArquivoTexto>Selecionar arquivo</CampoArquivoTexto>
        <CampoArquivoNome>
          {fileName || "Nenhum arquivo selecionado"}
        </CampoArquivoNome>
        <CampoArquivoInput accept={accept} onChange={handleChange} />
      </CampoArquivoCustom>
      {preview && (
        <PreviewImagem
          src={typeof preview === "string" ? preview : URL.createObjectURL(preview)}
          alt="Pré-visualização"
        />
      )}
    </CampoArquivoContainer>
  );
};

export default FileUpload;