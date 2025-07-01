class InstituicaoEnsino {
    constructor({ id, nome, cnpj, endereco }) {
        this.id = id;
        this.nome = nome;
        this.cnpj = cnpj;
        this.endereco = endereco;
        this.MAXENVIOPARAPROFESSOR = 1000; 
    }

    getMoedasPorMes() {
        return this.MAXENVIOPARAPROFESSOR; 
    }
}

module.exports = InstituicaoEnsino;