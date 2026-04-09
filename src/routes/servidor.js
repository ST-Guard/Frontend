var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.post("/cadastrarServ", function (req, res) {
    servidorController.cadastrarServidor(req, res);
});

router.get("/carregarDatabases/:fkEmpresa", function (req, res) {
    servidorController.carregarDatabases(req, res);
});

router.get("/carregarZonas/:idDataCenter", function (req, res) {
    servidorController.listarZonas(req, res);
});

router.get("/listarServidores/:idEmpresa", function (req, res) {
    servidorController.listarServidores(req, res);
});

router.post("/adicionarComponente", function (req, res) {
    servidorController.adicionarComponente(req, res);
});

module.exports = router;