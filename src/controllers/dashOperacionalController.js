require("dotenv").config();

var dashOperacionalModel = require("../models/dashOperacionalModel");

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

console.log("AWS_REGION:", process.env.aws_region);
console.log("aws_bucket_name:", process.env.aws_bucket_name);
console.log("TEM ACCESS KEY:", !!process.env.aws_access_key_id);
console.log("TEM SECRET KEY:", !!process.env.aws_secret_access_key);
console.log("TEM SESSION TOKEN:", !!process.env.aws_session_token);

const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
        sessionToken: process.env.aws_session_token
    }
});

async function buscarGestoraOpJson(req, res) {
    try {
        const comando = new GetObjectCommand({
            Bucket: process.env.aws_bucket_name,
            Key: "client/dashOpGestao.json"
        });

        const resposta = await s3.send(comando);
        const conteudo = await resposta.Body.transformToString();
        const json = JSON.parse(conteudo);

        res.status(200).json(json);

    } catch (erro) {
        console.error("Erro ao buscar dashOpGestao.json no S3:", erro);

        res.status(500).json({
            erro: "Erro ao buscar JSON da gestora no S3",
            detalhe: erro.message
        });
    }
}

function listarRegioes(req, res) {
    const idUsuario = req.params.idUsuario;

    dashOperacionalModel.listarRegioes(idUsuario)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarDatacenters(req, res) {
    const idUsuario = req.params.idUsuario;
    const idRegiao = req.params.idRegiao;

    dashOperacionalModel.listarDatacenters(idUsuario, idRegiao)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function listarRegioesDaEmpresa(req, res) {
    const idEmpresa = req.params.idEmpresa;

    console.log("REQ PARAMS:", req.params);
    console.log("ID EMPRESA RECEBIDO NO CONTROLLER:", idEmpresa);

    dashOperacionalModel.listarRegioesDaEmpresa(idEmpresa)
        .then(resultado => {
            res.status(200).json(resultado);
        })
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarDatacenters,
    listarRegioes,
    listarRegioesDaEmpresa,
    buscarGestoraOpJson
};