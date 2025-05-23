const express = require("express");
const router = express.Router();
const VantagemController = require("../controllers/VantagemController");
const autenticacao = require("../middlewares/autenticacao");

router.post("/", autenticacao, VantagemController.criar);
router.get("/minhas-vantagens", autenticacao, VantagemController.listarPorEmpresa);

router.get("/", VantagemController.listarTodasAtivas);

module.exports = router;