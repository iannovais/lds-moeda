class Vantagem {
    constructor({ id, nome, descricao, foto, custoMoedas, empresa_id, data_cadastro, ativo }) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.foto = foto;
        this.custoMoedas = custoMoedas;
        this.empresa_id = empresa_id;
        this.data_cadastro = data_cadastro || new Date();
        this.ativo = ativo !== undefined ? ativo : true;
    }
}

module.exports = Vantagem;