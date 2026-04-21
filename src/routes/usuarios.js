var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");


router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});
router.post("/cadastrarCompleto", function (req, res) {
    usuarioController.cadastrarCompleto(req, res);
});

router.get("/listar", function (req, res) {
    usuarioController.listar(req, res);
});

router.put("/mudarStatus/:idUsuario", function (req, res) {
    usuarioController.mudarStatus(req, res);
});

module.exports = router;