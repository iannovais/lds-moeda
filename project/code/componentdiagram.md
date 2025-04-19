@startuml
component "FrontEnd" as Browser
component "Backend" as Backend {
    component "Gerenciamento de Aluno"
    component "Gerenciamento de Professor"
    component "Gerenciamento de Empresa"
    component "Gerenciamento de Vantagem"
    component "Gerenciamento de Moeda"
    component "Autenticação"
    component "Notificações"
    component "Gerenciamento de Transações"
}
component "Database" as Database {
    component "Aluno"
    component "Professor"
    component "Empresa"
    component "InstituicaoEnsino"
    component "Curso"
    component "Departamento"
    component "Vantagem"
    component "Transacao"
    component "Login"
}

Browser --> Backend : HTTPS
Backend --> Database
@enduml
