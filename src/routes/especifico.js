var express = require("express");
var router = express.Router();

var especificoController = require("../controllers/especificoController");

router.get("/selectServidor/:idZona", function (req, res) {
    especificoController.selectServidor(req, res);
});

router.post("/puxarDadosEspecifico", function (req, res) {
    especificoController.puxarDadosEspecifico(req, res);
});

module.exports = router;