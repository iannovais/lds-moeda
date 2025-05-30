const express = require("express");
const router = express.Router();
const ProfessorController = require("../controllers/ProfessorController");
const autenticacao = require("../middlewares/autenticacao");

router.post("/", ProfessorController.criar);
router.get("/", autenticacao, ProfessorController.listarTodos);
router.get("/extrato", autenticacao, ProfessorController.getExtrato);
router.post("/enviar-moedas", autenticacao, ProfessorController.enviarMoedas);
router.get("/:id", autenticacao, ProfessorController.buscarPorID);
router.put("/:id", autenticacao, ProfessorController.atualizar);
//router.delete("/:id", autenticacao, ProfessorController.deletar);

module.exports = router;