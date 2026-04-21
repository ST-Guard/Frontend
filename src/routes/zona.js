var express = require("express");
var router = express.Router();

var zonaController = require("../controllers/zonaController");

router.get("/listar", function (req, res) {
    zonaController.listar(req, res);
});

module.exports = router;