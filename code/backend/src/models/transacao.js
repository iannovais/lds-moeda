class Transacao {
    constructor({ id, data, tipo, valorMoedas, mensagem, remetente_id, destinatario_id }) {
        this.id = id;
        this.data = data;
        this.tipo = tipo;
        this.valorMoedas = valorMoedas;
        this.mensagem = mensagem;
        this.remetente_id = remetente_id;
        this.destinatario_id = destinatario_id;
    }
}

module.exports = Transacao;