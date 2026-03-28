var faleconoscoModel = require("../models/faleconosocoModel")


function enviar(req, res){
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var mensagem = req.body.mensagemServer;
    
    
    if(nome == undefined || email == undefined || mensagem == undefined){
        return res.status(400).send("Mensagem indefinida");
    }

    faleconoscoModel.enviar(nome, email, mensagem)
        .then(
            function(resultadoenvio){
                res.status(200).json({mensagem: "mensagem enviada corretamente"});
            }
        ).catch(function (erro) {
            res.status(500)
        })
}


module.exports = {
    enviar
}