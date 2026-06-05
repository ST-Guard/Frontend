const { dadosFinanceira } = require("../controllers/financeiraController");
const database = require("../database/config");
require("dotenv").config({ path: ".env.dev" });
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
// npm install @aws-sdk/client-s3 dotenv

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
});

async function pegarDadosFinanceiro(bucket) {
  //pega os dados do Json finaneiro
  const parametros = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "client/dashboard_financeiro.json",
  };

  dadosFinanceiro = null;
  try {
    console.log("Entrou no try para buscar no S3 via AWS SDK");
    const command = new GetObjectCommand(parametros);
    const resposta = await s3Client.send(command);
    const stringData = await resposta.Body.transformToString();
    const dados = JSON.parse(stringData);
    console.log("Dados financeiros carregados com sucesso do S3:", dados);
    dadosFinanceiro = dados;
  } catch (erro) {
    console.error("Erro ao puxar dados do S3:", erro);
    throw erro;
  }

  //Pega os alertas do json alertas
  const parametrosAlertas = {
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: "client/alertas_gestora.json", };
  dadosAlertas = null
  try {
    const command = new GetObjectCommand(parametrosAlertas);
    const resposta = await s3Client.send(command);
    const stringData = await resposta.Body.transformToString();
    const dados = JSON.parse(stringData);
    console.log("Dados alertas carregados com sucesso do S3:", dados);
    dadosAlertas = dados
  } catch (error) {
    console.error("Erro ao gerar URL do S3:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }

  return {dadosFinanceiros: dadosFinanceiro, dadosAlertas: dadosAlertas}

  
}

module.exports = {
  pegarDadosFinanceiro,
};
