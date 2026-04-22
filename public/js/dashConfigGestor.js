if (!sessionStorage.ID_USUARIO) {
  alert("Você precisa estar logado!");
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
