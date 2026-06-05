var express = require("express");
var router = express.Router();
var path = require("path");
const financeiraController = require('../controllers/financeiraController.js');



router.post("/pegarDadosFinanceira", function (req, res) {
    financeiraController.dadosFinanceira(req, res);
});

router.get("/relatorios", function (req, res) {
    financeiraController.listarRelatorios(req, res);
});

router.get("/relatorios/url", function (req, res) {
    financeiraController.obterUrlRelatorio(req, res);
});



module.exports = router;
