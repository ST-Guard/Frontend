
require("dotenv").config({ path: ".env.dev" });
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});


function BuscarDadosANalista(){

    var parametros = {
        Bucket: process.env.AWS_BUCKET,
        Key: "client/dashboard_analista.json"
    }

    var funcao = new GetObjectCommand(parametros)


    return s3Client.send(funcao).then(resultado => resultado.Body.transformToString())
    .then(texto => JSON.parse(texto))

}




    



module.exports = {
    
    BuscarDadosANalista 
};