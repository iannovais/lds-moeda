const UsuarioDAO = require("../dao/UsuarioDAO");

class UsuarioController {
    async listarTodos(req, res) {
        try {
            const usuarios = await UsuarioDAO.listarTodos();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error("Erro:", error);
            res.status(500).json({ erro: "Erro ao buscar usuários." });
        }
    }


    async buscarPorID(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuarioDAO.buscarPorID(id);
            if (!usuario) {
                return res.status(404).json({ erro: "Usuário não encontrado." });
            }
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao buscar usuário." });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;
            const usuarioAtualizado = await UsuarioDAO.atualizar(id, dadosAtualizados);
            res.status(200).json(usuarioAtualizado);
        } catch (error) {
            res.status(500).json({ erro: "Erro ao atualizar usuário." });
        }
    }

    async deletar(req, res) {
        try {
            const { id } = req.params;
            await UsuarioDAO.deletar(id);
            res.status(200).json({ mensagem: "Usuário deletado com sucesso." });
        } catch (error) {
            res.status(500).json({ erro: "Erro ao deletar usuário." });
        }
    }
}

module.exports = new UsuarioController();