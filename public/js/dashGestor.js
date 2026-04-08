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
    const ctx = document.getElementById('chartusomedio');

    const data = {
        
        labels: ['23/03', '24/03', '25/03', '26/03', '27/03', '28/03', '29/03'],
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
            },
            {
                label: 'Temperatura', 
                data: [45, 38, 72, 85, 92, 68, 55],
                borderColor: '#F5CC4D',
                backgroundColor: '#F5CC4D',
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
                    text: 'Uso médio de Recursos (Diário)',
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

    
    const ctxBar = document.getElementById('chartpicousosemanal');
    const selectComponente = document.getElementById('select-componente');
    
    let meuGraficoBarra;

    const dadosPico = {
        'CPU': [78, 82, 91, 75, 88, 65, 58],
        'RAM': [45, 50, 55, 60, 58, 52, 48],
        'DISCO': [20, 22, 25, 30, 28, 26, 24]
    };

    
    function atualizarGrafico(componente) {
        const dataArray = dadosPico[componente];
        
        if (meuGraficoBarra) {
            meuGraficoBarra.destroy();
        }

        meuGraficoBarra = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: `Pico de ${componente}`,
                    data: dataArray,
                    backgroundColor: '#000000', 
                    borderRadius: 5,
                    barThickness: 30 
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } 
                },
                scales: {
                    x: { 
                        grid: { display: false } 
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) { return value + '%'; }
                        }
                    }
                }
            }
        });
    }

   
    atualizarGrafico('CPU');
    selectComponente.addEventListener('change', (e) => {
    atualizarGrafico(e.target.value);
});

    









});