var AnalistaModel = require("../models/BuscarDadosAnalistaModel");




function BuscarDadosAnalista(req,res){

        AnalistaModel.BuscarDadosANalista()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    BuscarDadosAnalista
}