window.onload = () => {
    buscarDados()
    listarFuncionarios();
    carregarZonas();
}

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
        if (dados.imagem) {
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}

function mascaraTel(cel) {
    var celular = cel.value.replace(/\D/g, "");

    if (celular.length > 11) celular = celular.slice(0, 11);

    if (celular.length > 0) {
        celular = celular.replace(/^(\d{2})(\d)/g, "($1) $2");
    }

    if (celular.length > 10) {
        celular = celular.replace(/(\d{5})(\d)/, "$1-$2");
    }

    cel.value = celular;
}

function limparTelefone(cel) {
    return cel.replace(/\D/g, "");
}

function mascaraCPF(cpfInput) {
    var cpf = cpfInput.value.replace(/\D/g, "");

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    if (cpf.length > 3) {
        cpf = cpf.replace(/^(\d{3})(\d)/, "$1.$2");
    }

    if (cpf.length > 6) {
        cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    }

    if (cpf.length > 9) {
        cpf = cpf.replace(/\.(\d{3})(\d)/, ".$1-$2");
    }

    cpfInput.value = cpf;
}

function limparCPF(cpf) {
    return cpf.replace(/\D/g, "");
}

function listarFuncionarios() {
    fetch("/usuarios/listar").then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                
                var container = document.getElementById("lista_funcionarios");
                container.innerHTML = ""; 

                var qtdAtivos = 0;
                var qtdInativos = 0;

                for (var i = 0; i < lista.length; i++) {
                    var f = lista[i];

                    if (f.status == 'Ativo' || f.status == 1) {
                        qtdAtivos++;
                    } else {
                        qtdInativos++;
                    }

                    var botaoHTML = "";
                    if (f.status == 'Ativo' || f.status == 1) {
                        botaoHTML = `<button class="funcionario_desativar" onclick="mudarStatus(${f.idUsuario}, 'Inativo')">Desativar Funcionário</button>`;
                    } else {
                        botaoHTML = `<button class="funcionario_ativar" onclick="mudarStatus(${f.idUsuario}, 'Ativo')">Ativar Funcionário</button>`;
                    }

                    
                    container.innerHTML += `
                        <div class="card_funcionario">
                            <div class="funcionario">
                                <div class="funcionario_avatar">
                                <img src="./../assets/img-funcionario/avatar.png" alt="Ícone" class="avatar_icone">
                                </div>
                                <div class="funcionario_info">
                                    <h3 class="funcionario_nome">${f.nome}</h3>
                                    <p class="funcionario_email">${f.email}</p>
                                    <p class="funcionario_telefone">${f.telefone || '(11) 99999-8888'}</p>
                                    <p class="funcionario_zona">${f.zona || "Sem zona"}</p>
                                </div>
                                <div class="funcionario_acoes">
                                    ${botaoHTML}
                                </div>
                            </div>
                        </div>
                    `;
                }

                
                document.getElementById("kpi_ativos").innerHTML = qtdAtivos;
                document.getElementById("kpi_inativos").innerHTML = `${qtdInativos} Inativos`;
            });
        }
    });
}

function mudarStatus(idUsuario, novoStatus) {
    console.log(`Tentando mudar status do usuário ${idUsuario} para ${novoStatus}`);

    fetch(`/usuarios/mudarStatus/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            statusServer: novoStatus
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            console.log("Status atualizado com sucesso!");
            listarFuncionarios();
        } else {
            throw ("Houve um erro ao tentar atualizar o status!");
        }
    }).catch(function (erro) {
        console.log(erro);
    });
}

function abrirModal() {
    document.getElementById("modal_cadastro").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modal_cadastro").style.display = "none";
    
    document.getElementById("input_nome_cadastro").value = "";
    document.getElementById("input_email_cadastro").value = "";
    document.getElementById("input_telefone_cadastro").value = "";
    document.getElementById("input_senha_cadastro").value = "";
    document.getElementById("input_cpf_cadastro").value = "";
    document.getElementById("select_zona_cadastro").value = "";
}

function cadastrar() {
    var nomeVar = input_nome_cadastro.value;
    var emailVar = input_email_cadastro.value;
    var senhaVar = input_senha_cadastro.value;
    var cpfVar = input_cpf_cadastro.value;
    var telefoneVar = input_telefone_cadastro.value; 
    var zonaVar = select_zona_cadastro.value;
    
    telefoneVar = limparTelefone(telefoneVar)
    cpfVar = limparCPF(cpfVar)

    if (nomeVar == "" || emailVar == "" || senhaVar == "" || cpfVar == "" || telefoneVar == "" || zonaVar == "") {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("/usuarios/cadastrar", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar,
            cpfServer: cpfVar,
            telefoneServer: telefoneVar, 
            zonaServer : zonaVar
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");
            fecharModal();
            listarFuncionarios(); 
        } else {
            console.log("Erro ao cadastrar");
            alert("Erro ao realizar o cadastro. Verifique o console.");
        }
    });
}

function carregarZonas() {
    fetch("/zonas/listar")
        .then(res => {
            if (!res.ok) throw new Error("Erro na rota: " + res.status);
            return res.json();
        })
        .then(zonas => {

            const select = document.getElementById("select_zona_cadastro");

            select.innerHTML = `<option value="">Selecione</option>`;

            zonas.forEach(z => {
                select.innerHTML += `
                    <option value="${z.idZona}">${z.nome}</option>
                `;
            });

        })
        .catch(erro => {
            console.log("Erro ao carregar zonas:", erro);
        });
}