const express = require("express");
const router = express.Router();
const AlunoController = require("../controllers/AlunoController");
const autenticacao = require("../middlewares/autenticacao");

router.get("/", autenticacao, AlunoController.listarTodos);
router.get("/:id", autenticacao, AlunoController.buscarPorID);
router.get("/extrato", autenticacao, AlunoController.getExtrato);
router.put("/:id", autenticacao, AlunoController.atualizar);
router.delete("/:id", autenticacao, AlunoController.deletar);

module.exports = router;