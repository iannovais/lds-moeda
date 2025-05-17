const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/UsuarioController");
const autenticacao = require("../middlewares/autenticacao");

router.get("/", autenticacao, UsuarioController.listarTodos);
router.get("/:id", autenticacao, UsuarioController.buscarPorID);
router.put("/:id", autenticacao, UsuarioController.atualizar);
router.delete("/:id", autenticacao, UsuarioController.deletar);

module.exports = router;