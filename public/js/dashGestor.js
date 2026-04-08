// function fnNavegar(local) {
//   window.location.href = local;
// }

// validarSessao();
// function validarSessao() {
//   var email = sessionStorage.EMAIL_USUARIO ? sessionStorage.EMAIL_USUARIO : null ;
//   var nome = sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : null;

//   var b_usuario = document.getElementById("b_usuario");

//   if (email != null && nome != null) {
//     b_usuario.innerHTML = nome;
//   } else {
//     console.log("AAAAAAAA");
//     window.location.href = "/pages/loginlogout/login.html";
//   }
// }

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

const ctx = document.getElementById('chartusomedio');

const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
       {
                    label: 'RAM',
                    data: [40, 35, 50, 70, 50, 20, 30],
                    borderColor: '#23B26D',
                    backgroundColor: '#23B26D',
                    
                    
                },
                {
                    label: 'CPU',
                    data: [30, 85, 20, 56, 90, 100, 20],
                    borderColor: '#f54d4d',
                    backgroundColor: '#F5CC4D',
                    
                },
                {
                    label: 'DISCO',
                    data: [45, 38, 80, 20, 98, 67, 54],
                    borderColor: '#F65CA4',
                    backgroundColor: '#F65CA4',
                    
                }
]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        // Configuração do Header (Título)
        title: {
            display: true,
            text: 'Uso médio de recursos (Diário)',
            fontSize: 18
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Recursos'
                },
                ticks: {
                    beginAtZero: true
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Uso em (%)' 
                },
                ticks: {
                    beginAtZero: true,
                    suggestedMax: 100 
                }
            }]
        }
    }
};

new Chart(ctx, config);

});
