const {S3Client,ListObjectsV2Command,GetObjectCommand} = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({region: process.env.aws_region || "us-east-1",

    credentials: {
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
        sessionToken: process.env.aws_session_token
    }
});

const bucket = "smartdatabucket2";

function formatarNomePasta(texto) {
    return texto.trim().replaceAll(" ", "-").replaceAll("/", "-").replaceAll("\\", "-").replaceAll(":", "-");
}

async function listarRelatorios(nomeEmpresa, nomeDatacenter) {
    const empresaFormatada = formatarNomePasta(nomeEmpresa);
    const datacenterFormatado = formatarNomePasta(nomeDatacenter);

    const prefixo = `relatorios/gestora/${empresaFormatada}/${datacenterFormatado}/`;

    const comandoListagem = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefixo
    });

    const resposta = await s3.send(comandoListagem);

    const arquivos = resposta.Contents || [];

    const relatoriosPdf = arquivos
        .filter((arquivo) => {
            return arquivo.Key && arquivo.Key.toLowerCase().endsWith(".pdf");
        })
        .sort((arquivoA, arquivoB) => {
            return new Date(arquivoB.LastModified) - new Date(arquivoA.LastModified);
        });

    const relatoriosComUrl = await Promise.all(
        relatoriosPdf.map(async (arquivo) => {
            const comandoDownload = new GetObjectCommand({
                Bucket: bucket,
                Key: arquivo.Key,
                ResponseContentDisposition: `attachment; filename="${obterNomeArquivo(arquivo.Key)}"`,
                ResponseContentType: "application/pdf"
            });

            const urlTemporaria = await getSignedUrl(
                s3,
                comandoDownload,
                {
                    expiresIn: 900
                }
            );

            return {
                nomeArquivo: obterNomeArquivo(arquivo.Key),
                chave: arquivo.Key,
                tamanhoBytes: arquivo.Size || 0,
                ultimaModificacao: arquivo.LastModified,
                urlDownload: urlTemporaria
            };
        })
    );

    return relatoriosComUrl;
}

function obterNomeArquivo(chave) {
    const partes = chave.split("/");
    return partes[partes.length - 1];
}

module.exports = {
    listarRelatorios
};