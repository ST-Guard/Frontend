var express = require("express");
var router = express.Router();

var servidorController = require("../controllers/servidorController");

router.post("/cadastrarServ", function (req, res) {
    servidorController.cadastrarServidor(req, res);
});

router.post("/cadastrarCompo", function (req, res) {
    servidorController.cadastrarComponente(req, res);
});

router.get("/carregarDatabases/:fkEmpresa", function (req, res) {
    servidorController.carregarDatabases(req, res);
});

router.post("/cadastrarZona", function (req, res) {
    servidorController.cadastrarZona(req, res);
});

router.get("/zonas", function (req, res) {
    servidorController.listarZonas(req, res);
});

module.exports = router;