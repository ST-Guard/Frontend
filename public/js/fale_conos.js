function fnNavegar(caminho){
    window.location.href = caminho
}
function enviar_mensagem(){
    
    var nome_usuario  = input_nome.value
    var email_usuario = input_email.value.trim()
    var mensagem_usuario = input_mensagem.value
    var mensagem =""
    var contador_validações = 0

    if(nome_usuario.trim() == "" || email_usuario.trim() == "" || mensagem_usuario.trim() == ""){
        mensagem = "<h1>Não pode conter campos vazios!</h1>"
        contador_validações += 1
    }

    if(nome_usuario.length > 45){
        mensagem += "<h1>Nome muito longo!</h1>"
        contador_validações += 1
    }

    if(email_usuario.includes('@') != true || email_usuario.includes('.com') != true){
        mensagem += "<h1>Email invalido!</h1>"
        contador_validações += 1
    }

        

    mensagem_erro.innerHTML = mensagem

    if(contador_validações < 1) {
        
        fetch("/enviar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nomeServer: nome_usuario,
                emailServer: email_usuario,
                mensagemServer: mensagem_usuario
            })
        }).then(function(resposta){
              mensagem_erro.innerHTML = "<p>Mensagem enviada com sucesso!</p>"
        }).catch(function(erro) {
            
    mensagem_erro.innerHTML = "<h1>erro servidor</h1>"
        })


                fetch("https://api.staticforms.xyz/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                accessKey: "",
                nome: nome_usuario,
                email: email_usuario,
                mensagem: mensagem_usuario
            })
        }).then(function(resposta){
            
            console.log("deu certo")
        }).catch(function(erro) {
            
    mensagem_erro.innerHTML = "<h1>erro servidor</h1>"
        })
      
    }

} 