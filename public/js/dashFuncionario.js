if (!sessionStorage.ID_USUARIO) {
  alert("Você precisa estar logado!");
  window.location = "login.html";
}

function mudarDash() {
    window.location = "dashboardGestor.html"
}

function mudarServidor() {
    window.location = "dashServidor.html"
}

function mudarAlerta() {
    window.location = "dashboardAlertas.html"
}

function mudarFuncionario() {
    window.location = "cadastroFuncionario.html"
}

function mudarConfig() {
    window.location = "config.html"
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
                                <div class="funcionario_avatar"></div>
                                <div class="funcionario_info">
                                    <h3 class="funcionario_nome">${f.nome}</h3>
                                    <p class="funcionario_email">${f.email}</p>
                                    <p class="funcionario_telefone">${f.telefone || '(11) 99999-8888'}</p>
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
}

function cadastrar() {
    var nomeVar = input_nome_cadastro.value;
    var emailVar = input_email_cadastro.value;
    var senhaVar = input_senha_cadastro.value;
    var cpfVar = input_cpf_cadastro.value;
    var telefoneVar = input_telefone_cadastro.value; 
    var cargoVar = select_cargo_cadastro.value;

    if (nomeVar == "" || emailVar == "" || senhaVar == "" || cpfVar == "" || telefoneVar == "" || cargoVar == "") {
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
            cargoServer: cargoVar
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

window.onload = listarFuncionarios;