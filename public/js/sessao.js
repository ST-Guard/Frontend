function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

fetch(`/sessao/buscarUsuario`, {
})
  .then(function (resposta) {
    return resposta.json();
})
.then(function (campanhas) {
    const ultimoId = campanhas[campanhas.length - 1].idCampanha
    console.log(ultimoId)
})
