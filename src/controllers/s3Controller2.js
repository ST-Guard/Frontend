const { S3Client, GetObjectCommand }
    = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    sessionToken: process.env.aws_session_token,
  },
});

async function obterS3UrlController2(req, res) {
    
    const parametros = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: 'client/alertas_gestora.json', 
    };

    try {
        const command = new GetObjectCommand(parametros);
        const resposta = await s3Client.send(command);
        const stringData = await resposta.Body.transformToString();
        const dados = JSON.parse(stringData);
        console.log("Dados alertas_gestora.json carregados com sucesso do S3!");
        
        return res.status(200).json(dados);
    } catch (error) {
        console.error('Erro ao gerar URL do S3:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}


module.exports = {
    obterS3UrlController2
};
