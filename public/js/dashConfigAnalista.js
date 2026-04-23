window.onload = buscarDados()

// if (!sessionStorage.ID_USUARIO) {
//     modal.style.display = "flex"
//     conteiner_msg.innerHTML = `Você precisa estar logado!`
//     loadingModal()
//     window.location = "login.html";
// }

if (!sessionStorage.ID_USUARIO) {
  alert("Você precisa estar logado!");
  window.location = "login.html";
}

function buscarDados() {
    const idUsuario = sessionStorage.ID_USUARIO
    
    fetch(`/sessao/buscarUsuario/${idUsuario}`, {
    })
      .then(function (resposta) {
        return resposta.json();
    })
    .then(function (dados) {
        dados = dados[0]

        username.innerHTML = dados.nomePessoa
        cargoname.innerHTML = dados.cargo
        nome.value = dados.nomePessoa
        telefone.value = dados.telefone
        email.value = dados.email
        cargo.value = dados.cargo
        bio.value = dados.bio
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
            imgPerfil.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
            imgPerfil.src = "../assets/dashConfig/usuario.png"
        }
    })
}

function mudarImagemPerfil() {
    document.getElementById("inpImagem").click();
}
    
function salvarImagemPerfil() {
    const inpImagem = document.getElementById("inpImagem");
    
    var foto = inpImagem.files[0]
    
    const formData = new FormData();
    formData.append('idUsuario', sessionStorage.ID_USUARIO);
    formData.append('fotoPerfil', foto)
    
    fetch("/sessao/imagemPerfil", {
        method: "PUT",
        body: formData
    })
    .then(
        res => res.json()
    )
    .then( dados => {
        console.log("Imagem salva:", dados);

        const imgPerfil = document.getElementById("imgPerfil");
        
        if (imgPerfil) imgPerfil.src = `/assets/imgsBd/${dados.imagem}`;

        buscarDados()
    })
    .catch(
        err => console.log(err)
    );
}

function mascaraTel(i) {
    var celular = i.value.replace(/\D/g, "");

    if (celular.length > 11) celular = celular.slice(0, 11);

    if (celular.length > 0) {
        celular = celular.replace(/^(\d{2})(\d)/g, "($1) $2");
    }

    if (celular.length > 10) {
        celular = celular.replace(/(\d{5})(\d)/, "$1-$2");
    }

    i.value = celular;
}

function limparTelefone(tel) {
    return tel.replace(/\D/g, "");
}

function salvar() {
    console.log("SALVAR ANALISTA");
    const idUsuario = sessionStorage.ID_USUARIO
    const nomeVar = document.getElementById("nome").value;
    let telefoneVar = document.getElementById("telefone").value;

    telefoneVar = limparTelefone(telefoneVar)

    if (!nomeVar.trim() || !nomeVar) {
        alert("Nome incorreto")
        return
    } else if (telefoneVar.length != 11) {
        alert("Telefone incorreto")
        return
    }

    fetch("/sessao/alterarUsuario", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idUsuario: idUsuario,
            nome: nomeVar,
            telefone: telefoneVar
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erro ao atualizar usuário");
        }
        return res.json();
    })
    .then(dados => {
        alert("Dados salvos");
        buscarDados();
    })
    .catch(err => console.log(err));
}

function limparSessao() {
    sessionStorage.clear();
}