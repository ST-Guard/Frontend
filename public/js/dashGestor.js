// function fnNavegar(local) {
//   window.location.href = local;
// }
// document.addEventListener('DOMContentLoaded', () => {

// validarSessao();
//     function validarSessao() {
//     var email = sessionStorage.EMAIL_USUARIO ? sessionStorage.EMAIL_USUARIO : null ;
//     var nome = sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : null;

//     var b_usuario = document.getElementById("b_usuario");

//     if (email != null && nome != null) {
//         b_usuario.innerHTML = nome;
//     } else {
//         console.log("AAAAAAAA");
//         window.location.href = "/pages/loginlogout/login.html";
//     }
//     }
// })

function mudarDash() {
    window.location = "dashGestor_modelo.html"
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

// DASHBOARD


// Precisa do DOMcontentLoaded, pq garante que os elementos do html carreguem antes de pegar o id do char, saco?
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('chartRamxCpu');

    const data = {
        
        labels: ['', '', '', '', '', '', ''],
        datasets: [
            {
                label: 'RAM',
                data: [40, 35, 50, 70, 50, 20, 30],
                borderColor: '#23B26D',
                backgroundColor: '#23B26D',
                tension: 0.4 
            },
            {
                label: 'CPU',
                data: [30, 85, 20, 56, 90, 100, 20],
                borderColor: '#f54d4d',
                backgroundColor: '#f54d4d',
                tension: 0.4
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                title: {
                    display: true,
                    text: 'Comparando Ram e CPU',
                    font: { size: 18 }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                x: { 
                    title: {
                        display: true,
                        text: 'Dias'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Uso (%)'
                    }
                }
            }
        }
    };

    new Chart(ctx, config);


    // SEGUNDO GRAFICOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

    
    const ctxBar = document.getElementById('chartServer');

    let graficoBarraServer;

    const dadosPico = {
    Server_1: [4, 5, 5, 0, 8, 2, 8],
    Server_2: [2, 2, 2, 3, 5, 6, 4],
    Server_3: [2, 5, 1, 5, 8, 6, 8],
    };

    function somarAlertas(lista) {
    let total = 0;

    for (let i = 0; i < lista.length; i++) {
        total += lista[i];
    }

    return total;
    }

    function atualizarGrafico() {

    const totalServer1 = somarAlertas(dadosPico.Server_1);
    const totalServer2 = somarAlertas(dadosPico.Server_2);
    const totalServer3 = somarAlertas(dadosPico.Server_3);

    if (graficoBarraServer) {
        graficoBarraServer.destroy();
    }

    graficoBarraServer = new Chart(ctxBar, {
        type: 'bar',
        data: {
        labels: ['Servidor 1', 'Servidor 2', 'Servidor 3'],
        datasets: [{
            label: 'Quantidade de Alertas',
            data: [totalServer1, totalServer2, totalServer3],
            backgroundColor: ['#5dade2', '#2ecc71', '#f54d4d'],
            borderRadius: 5,
            barThickness: 40
        }]
        },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
            display: false
            }
        },
        scales: {
            x: {
            grid: {
                display: false
            }
            },
            y: {
            beginAtZero: true
            }
        }
        }
    });
    }

    atualizarGrafico();
})