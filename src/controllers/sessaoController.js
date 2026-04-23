const fs = require("fs");
const path = require("path");
var sessaoModel = require("../models/sessaoModel");
const { bus } = require("nodemon/lib/utils");

function buscarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!idUsuario) {
        res.status(400).send("Usuário não autenticado");
    } else {
        sessaoModel.buscarUsuario(idUsuario)
            .then(function(resultado) {
                res.json(resultado);
            })
            .catch(function(erro) {
                console.log(erro);
                console.log("Houve um erro ao buscar usuário! Erro: " + erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function alterarUsuario(req, res) {
    var idUsuario = req.body.idUsuario;
    var nome = req.body.nome;
    var telefone = req.body.telefone;

    if (!idUsuario) {
        return res.status(400).json({ erro: "Usuário não autenticado" });
    }

    sessaoModel.alterarUsuario(idUsuario, nome, telefone)
        .then(function(resultado) {
            res.status(200).json({
                mensagem: "Usuário atualizado com sucesso"
            });
        })
        .catch(function(erro) {
            console.log(erro);
            console.log("Houve um erro ao atualizar usuário! Erro: " + erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function salvarImagemPerfil(req, res) {
  var idUsuario = req.body.idUsuario;
  const novaImagem = req.file?.filename;
  
  if (!idUsuario || !novaImagem) {
    return res.status(400).json({ erro: "Nenhuma imagem enviada" });
  }

  sessaoModel.buscarImagemPerfil(idUsuario)
    .then(resultado => {
      const imagemAntiga = resultado[0]?.imagem;

      if (imagemAntiga && imagemAntiga !== "usuario.png") {
        const caminhoImagem = path.join(__dirname, "../../public/assets/imgsBd", imagemAntiga);

        fs.unlink(caminhoImagem, (err) => {
          if (err) {
            console.log("Erro ao apagar imagem antiga:", err.message);
          } else {
            console.log("Imagem antiga apagada:", imagemAntiga);
          }
        });
      }

      return sessaoModel.salvarImagemPerfil(idUsuario, novaImagem);
    })
    .then(resultado => {
      res.status(200).json({
        msg: "Imagem enviada com sucesso",
        imagem: novaImagem
      });
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
  }

function buscarImagemPerfil(req, res) {
  const idUsuario = req.params.idUsuario;

  sessaoModel.buscarImagemPerfil(idUsuario)
    .then(resultado => {
      if (resultado.length > 0 && resultado[0].imagem) {
        res.json({ imagem: resultado[0].imagem });
      } else {
        res.json({ imagem: null });
      }
    })
    .catch(err => res.status(500).json(err));
}

module.exports = {
    buscarUsuario,
    alterarUsuario,
    salvarImagemPerfil,
    buscarImagemPerfil
};