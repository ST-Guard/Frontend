var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/servidorController");

router.post("/cadastrarServ", function (req, res) {
    usuarioController.cadastrarServidor(req, res);
});

router.post("/cadastrarCompo", function (req, res) {
    usuarioController.cadastrarComponente(req, res);
});

module.exports = router;