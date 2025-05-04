```
@startuml

' Entidades
entity Usuario {
  *id: int <<PK>>
  --
  nome: String
  email: String
  senha: String
  dataCadastro: Date
}

entity Aluno {
  *id: int <<PK, FK>>
  --
  CPF: String
  RG: String
  endereco: String
  curso: String
  saldoMoedas: int
}

entity Professor {
  *id: int <<PK, FK>>
  --
  CPF: String
  departamento: String
  saldoMoedas: int
}

entity Empresa {
  *id: int <<PK, FK>>
  --
  CNPJ: String
  endereco: String
}

entity InstituicaoEnsino {
  *id: int <<PK>>
  --
  razaoSocial: String
  CNPJ: String
  endereco: String
}

entity Vantagem {
  *id: int <<PK>>
  --
  nome: String
  descricao: String
  foto: String
  custoMoedas: int
  empresa_id: int <<FK>>
}

entity Transacao {
  *id: int <<PK>>
  --
  data: Date
  tipo: String
  valorMoedas: int
  motivo: String
  codigoCupom: String
  aluno_id: int <<FK>>
  professor_id: int <<FK>>
  vantagem_id: int <<FK>>
}

' Relacionamentos
Usuario ||--|| Aluno
Usuario ||--|| Professor
Usuario ||--|| Empresa

InstituicaoEnsino ||--o{ Aluno
InstituicaoEnsino ||--o{ Professor

Empresa ||--o{ Vantagem
Vantagem ||--|| Transacao : utilizada_em

Aluno ||--o{ Transacao : resgata
Professor ||--o{ Transacao : concede

@enduml
```
