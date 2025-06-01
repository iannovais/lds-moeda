const express = require('express');
const router = express.Router();
const instituicaoEnsinoController = require('../controllers/instituicaoEnsinoController');

router.get('/', instituicaoEnsinoController.listar);

module.exports = router;
