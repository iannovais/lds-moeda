const express = require("express");
const router = express.Router();
const EmpresaController = require("../controllers/EmpresaController");
const autenticacao = require("../middlewares/autenticacao");

router.get("/", autenticacao, EmpresaController.listarTodos);
router.get("/:id", autenticacao, EmpresaController.buscarPorID);
router.put("/:id", autenticacao, EmpresaController.atualizar);
router.delete("/:id", autenticacao, EmpresaController.deletar);

module.exports = router;