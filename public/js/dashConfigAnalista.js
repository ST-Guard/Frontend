if (!sessionStorage.ID_USUARIO) {
    modal.style.display = "flex"
    conteiner_msg.innerHTML = `Você precisa estar logado!`
    loadingModal()
    window.location = "login.html";
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