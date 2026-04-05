var servidorModel = require("../models/servidorModel");

function cadastrarServidor(req, res) {

    const nomeServidor = req.body.nomeServ
    const tipoServidor = req.body.tipoServ
    const estadoServidor = req.body.estadoServ

    if (nomeServidor == undefined) {
        res.status(400).send("Nome do servidor está inválido!");
    } 
    else if (tipoServidor == undefined) {
        res.status(400).send("Tipo do servidor está inválido!");
    } 
    else if (estadoServidor == undefined) {
        res.status(400).send("Estado do servidor inválido!");
    } else {
        servidorModel.cadastrarServidor(nomeServidor, tipoServidor, estadoServidor)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ) .catch(
                function(erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarComponente(req, res) {

    const nomeComponente = req.body.nomeCompo
    const tipoComponente = req.body.tipoCompo
    const unidComponente = req.body.unidCompo
    const capComponente = req.body.capCompo

    if (nomeComponente == undefined) {
        res.status(400).send("Nome do componente está inválido!");
    } 
    else if (tipoComponente == undefined) {
        res.status(400).send("Tipo do componente está inválido!");
    } 
    else if (unidComponente == undefined) {
        res.status(400).send("Unidade do componente inválida!");
    } 
    else if (capComponente == undefined) {
        res.status(400).send("Capacidade do componente inválida!");
    } else {
        servidorModel.cadastrarComponente(nomeComponente, tipoComponente, unidComponente, capComponente)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ) .catch(
                function(erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

module.exports = {
    cadastrarServidor,
    cadastrarComponente
}