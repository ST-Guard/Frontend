var buscarZona = require("../models/BuscarZonas");

function enviar(req, res){
    var id = req.body.idUsuario;

    
    
    if(id == undefined){
        return res.status(400).send("Mensagem indefinida");
    }

    buscarZona.BuscarZona(id)
        .then(
            function(resultadoenvio){
                res.status(200).json({resultadoenvio});
            }
        ).catch(function (erro) {
            res.status(500)
        })
}


function enviar2(req,res){
    var id = req.body.idUsuario;

    
    
    if(id == undefined){
        return res.status(400).send("Mensagem indefinida");
    }

    buscarZona.BuscarDados_Empresa(id)
        .then(
            function(resultadoenvio){
                res.status(200).json({resultadoenvio});
            }
        ).catch(function (erro) {
            res.status(500)
        })


}


module.exports = {
    enviar,
    enviar2
}