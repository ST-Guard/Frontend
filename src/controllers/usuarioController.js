var usuarioModel = require("../models/usuarioModel");
// var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        return res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        return res.status(400).send("Sua senha está indefinida!");
    }

    usuarioModel.autenticar(email, senha)
        .then(
            function (resultadoAutenticar) {
                console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

            if (resultadoAutenticar.length == 1) {
                res.json({
                    idUsuario: resultadoAutenticar[0].idUsuario,
                    email: resultadoAutenticar[0].email,
                    nome: resultadoAutenticar[0].nome,
                    fkPapel: resultadoAutenticar[0].fkPapel
                });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).send("Email e/ou senha inválido(s)");
                } else {
                    res.status(403).send("Mais de um usuário com o mesmo login!");
                }
        }
        )
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}


function cadastrar(req, res) {
    
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var cpf = req.body.cpfServer;
    var senha = req.body.senhaServer;
    var telefone = req.body.telefoneServer;
    var fkPapel = req.body.cargoServer;
    // var dt = req.body.dtServer;
    // var servidor = req.body.servidorServer;


    
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
    } else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!");
    } else if (fkPapel == undefined) {
        res.status(400).send("Seu cargo está undefined!");
    // else if (dt == undefined) {
    //     res.status(400).send("Seu DataCenter está undefined!");
    // } else if (servidor == undefined) {
    //     res.status(400).send("Seu Servidor está undefined!");
    // } 
    }else {
        
        usuarioModel.cadastrar(nome, email, cpf, telefone, senha, fkPapel)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
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

var usuarioModel = require("../models/usuarioModel");

function listar(req, res) {
    usuarioModel.listar().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage);
    });
}

function mudarStatus(req, res) {
    var idUsuario = req.params.idUsuario;
    var novoStatus = req.body.statusServer;

    usuarioModel.mudarStatus(idUsuario, novoStatus)
        .then(function (resultado) {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}





module.exports = {
    autenticar,
    cadastrar,
    listar,
    mudarStatus
}