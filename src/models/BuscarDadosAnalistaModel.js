
require("dotenv").config({ path: ".env.dev" });
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");


const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_NAME,
    credentials: {
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
        sessionToken: process.env.aws_session_token
    }
});


function BuscarDadosANalista(){

    var parametros = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: "client/dashboard_analista.json"
    }

    var funcao = new GetObjectCommand(parametros)


    return s3Client.send(funcao).then(resultado => resultado.Body.transformToString())
    .then(texto => JSON.parse(texto))

}




    



module.exports = {
    
    BuscarDadosANalista 
};
