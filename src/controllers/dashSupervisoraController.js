const { S3Client, GetObjectCommand }
    = require('@aws-sdk/client-s3');

const { getSignedUrl }
    = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

async function obterDashboardSupervisora(req, res) {

    try {

        const comando = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: 'client/dashboard_regional.json'
        });

        const url = await getSignedUrl(
            s3Client,
            comando,
            { expiresIn: 300 }
        );

        return res.json({ url });

    } catch (erro) {

        console.error(
            'Erro ao gerar URL dashboard:',
            erro
        );

        return res.status(500).json({
            erro: 'Erro interno'
        });
    }
}

module.exports = {
    obterDashboardSupervisora
};