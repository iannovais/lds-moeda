```
@startuml

enum TipoUsuario {
  professor
  aluno
  empresa
}

class Usuario {
  + id: int
  + nome: String
  + email: String
  + senha: String
  + dataCadastro: Date
  + tipo: TipoUsuario
  + cadastrar(nome : string, senha : string) : void 
  + login(nome : string, senha : string) : void 
}

class Aluno extends Usuario {
  + CPF: String
  + RG: String
  + endereco: String
  + curso: String
  + saldoMoedas: int
}

class Professor extends Usuario {
  + MAXMOEDASPORSEMESTRE : int = 1000
  + CPF: String
  + departamento: String
  + saldoMoedas: int
  + enviarMoedas(aluno: Aluno, quantidade: int, motivo: String): void
}

class Empresa extends Usuario {
  + CNPJ: String
  + endereco: String
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
  + resgatarVantagem(): void
  + registrarVantagem(): void
}

class Transacao {
  + id: int
  + data: Date
  + tipo: String
  + valorMoedas: int
  + motivo: String
  + codigoCupom: String
}

Aluno "1" -- "*" Transacao : recebe/resgata
Professor "1" -- "*" Transacao : concede
Empresa "1" -- "*" Vantagem : oferece
Vantagem "1" -- "1" Transacao : utilizada_em
InstituicaoEnsino "1" -- "*" Aluno : possui
InstituicaoEnsino "1" -- "*" Professor : possui

@enduml
```