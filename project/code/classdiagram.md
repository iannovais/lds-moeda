```
@startuml

class Usuario {
  + id: int
  + nome: String
  + email: String
  + senha: String
  + dataCadastro: Date
  + cadastrar(nome : string, senha : string) : void 
  + login(nome : string, senha : string) : void 
}

class Aluno {
  + CPF: String
  + RG: String
  + endereco: String
  + curso: String
  + saldoMoedas: int
  + resgatarVantagem(vantagem: Vantagem): void
}

class Professor {
  + CPF: String
  + departamento: String
  + saldoMoedas: int
  + enviarMoedas(aluno: Aluno, quantidade: int, motivo: String): void
}

class Empresa {
  + CNPJ: String
  + endereco: String
  + registrarVantagem(vantagem: Vantagem): void
}

class InstituicaoEnsino {
  + id: int
  + razaoSocial: String
  + CNPJ: String
  + endereco: String
  + registrarProfessor(professor: Professor): void
}

class Vantagem {
  + id: int
  + nome: String
  + descricao: String
  + foto: String
  + custoMoedas: int
}

class Transacao {
  + id: int
  + data: Date
  + tipo: String
  + valorMoedas: int
  + motivo: String
  + codigoCupom: String
}

Usuario <|-- Aluno
Usuario <|-- Professor
Usuario <|-- Empresa

Aluno "1" --> "N*" Transacao : recebe/resgata
Professor "1" --> "N*" Transacao : concede
Empresa "1" --> "N*" Vantagem : oferece
Vantagem "1" --> "1" Transacao : utilizada_em
InstituicaoEnsino "1" --> "N*" Aluno : possui
InstituicaoEnsino "1" --> "N*" Professor : possui

@enduml
```