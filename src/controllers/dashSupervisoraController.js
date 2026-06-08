const { S3Client, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
});

async function obterDashboardSupervisora(req, res) {
    console.log("A");
    
    const parametros = {
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: "client/dashboard_regional.json", 
    };
    
    try {
        const command = new GetObjectCommand(parametros);
        const resposta = await s3Client.send(command);
        const stringData = await resposta.Body.transformToString();
        const dados = JSON.parse(stringData);
        
        console.log("Dados supervisora carregados com sucesso do S3!");
        
    
        return res.status(200).json(dados);

    } catch (erro) {
        console.error('Erro ao gerar URL dashboard:', erro);

        return res.status(500).json({
            erro: 'Erro interno ao buscar os dados'
        });
    }
}

module.exports = {
    obterDashboardSupervisora
};