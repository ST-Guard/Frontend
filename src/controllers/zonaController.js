var zonaModel = require("../models/zonaModel");

function listar(req, res) {
    zonaModel.listar()
        .then(resultado => res.json(resultado))
        .catch(erro => res.status(500).json(erro));
}

module.exports = {
    listar
};