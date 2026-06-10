require("dotenv").config({ path: ".env.dev" });
const { S3Client, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// npm install @aws-sdk/client-s3 dotenv

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
});

function normalizarAlertasPorRegiao(dados) {
  const empresa = dados && dados.Steam;

  if (!empresa || typeof empresa !== "object") return dados;

  const entradas = Object.entries(empresa);
  const formatoJaRegionalizado = entradas.every(([, valor]) =>
    valor && typeof valor === "object" && !valor.KPIs
  );

  if (formatoJaRegionalizado) return dados;

  const regioes = {};

  for (const [nomeDataCenter, conteudo] of entradas) {
    const correspondencia = nomeDataCenter.match(/^DC-([^-]+)-/i);
    const regiao = correspondencia ? correspondencia[1].toUpperCase() : "OUTROS";

    if (!regioes[regiao]) regioes[regiao] = {};
    regioes[regiao][nomeDataCenter] = conteudo;
  }

  return { ...dados, Steam: regioes };
}

async function pegarDadosFinanceiro(bucket) {
  //pega os dados do Json finaneiro
  const parametros = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "client/dashboard_financeiro.json",
  };

  let dadosFinanceiro = null;
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
  Key: "client/alertas_gestora.json", 
  };
  let dadosAlertas = null;
  try {
    const command = new GetObjectCommand(parametrosAlertas);
    const resposta = await s3Client.send(command);
    const stringData = await resposta.Body.transformToString();
    const dados = JSON.parse(stringData);
    console.log("Dados alertas carregados com sucesso do S3:", dados);
    dadosAlertas = normalizarAlertasPorRegiao(dados);
  } catch (error) {
    console.error("Erro ao buscar alertas no S3:", error);
    throw error;
  }

  return {dadosFinanceiros: dadosFinanceiro, dadosAlertas: dadosAlertas}

  
}




const mesesRelatorio = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function ehRelatorioFinanceiro(chave) {
  if (typeof chave !== "string") return false;

  const prefixo = "relatorios/relatorio-financeiro-";
  const extensao = ".pdf";
  const chaveNormalizada = chave.toLowerCase();

  if (!chaveNormalizada.startsWith(prefixo)
    || !chaveNormalizada.endsWith(extensao)) {
    return false;
  }

  const periodo = chaveNormalizada
    .slice(prefixo.length, -extensao.length)
    .split("-");

  if (periodo.length !== 2) return false;

  const [mes, ano] = periodo;
  const anoPossuiApenasNumeros = [...ano].every(caractere =>
    caractere >= "0" && caractere <= "9"
  );

  return mesesRelatorio.includes(mes)
    && ano.length === 4
    && anoPossuiApenasNumeros;
}


async function listarRelatoriosFinanceiros() {
  const relatorios = [];
  let tokenContinuacao;

  do {
    const comando = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: "relatorios/",
      ContinuationToken: tokenContinuacao,
    });
    const resposta = await s3Client.send(comando);

    (resposta.Contents || []).filter(arquivo =>
        ehRelatorioFinanceiro(arquivo.Key)
      )
      .forEach(arquivo => {
        relatorios.push({
          chave: arquivo.Key,
          nomeArquivo: arquivo.Key.split("/").pop(),
          tamanho: arquivo.Size || 0,
          ultimaModificacao: arquivo.LastModified || null,
        });
      });

    tokenContinuacao = resposta.IsTruncated
      ? resposta.NextContinuationToken
      : undefined;
  } while (tokenContinuacao);

  return relatorios;
}

async function gerarUrlRelatorioFinanceiro(chave) {
  const chaveValida = ehRelatorioFinanceiro(chave);

  if (!chaveValida) {
    throw new Error("Relatório inválido.");
  }

  const comando = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: chave,
    ResponseContentType: "application/pdf",
    ResponseContentDisposition: `inline; filename="${chave.split("/").pop()}"`,
  });

  return getSignedUrl(s3Client, comando, { expiresIn: 900 });
}

module.exports = {
  pegarDadosFinanceiro,
  listarRelatoriosFinanceiros,
  gerarUrlRelatorioFinanceiro,
};
