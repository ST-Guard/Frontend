function fnNavegar(local) {
    window.location.href = local
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
        //dataCenterTitulo.innerHTML = dados.nomeDataCenter
        console.log("Teste")
        if (dados.imagem) {
            console.log(dados.imagem)
            imagemPerfilCima.src = `/assets/imgsBd/${dados.imagem}`
        } else {
            imagemPerfilCima.src = "../assets/dashConfig/usuario.png"
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    buscarDados()
    const ctxUsoRam = document.getElementById('graficoRam');
    const ctxUsoCpu = document.getElementById('graficoCpu');
    const ctxUsoDisco = document.getElementById('graficoDisco');
    const ctxRamCpu = document.getElementById('chartRamxCpu');
    const ctxDiskLat = document.getElementById('chartDiskxLat');
    const ctxComponentes = document.getElementById('graficoComponentes');

    new Chart(ctxUsoRam, {
        type: 'doughnut',
        data: {
            labels: ['Disponível: ', 'Em uso: '],
            datasets: [{
                data: [22, 78],
                backgroundColor: [
                    '#22C55E',
                    '#EF4444',
                ],
                borderWidth: 5,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "48%",
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Uso de RAM',
                        align: 'start',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                        }
                    },
                    // subtitle: {
                    //     display: true,
                    //     text: 'Total de alertas por severidade',
                    //     align: 'start',
                    //     font: {
                    //         size: 18
                    //     },
                    //     padding: {
                    //         bottom: 30,
                    //     }
                    // },
                    tooltip: {
                        enabled: true
                    }
                },
            }
        
    }),

    new Chart(ctxUsoCpu, {
        type: 'doughnut',
        data: {
            labels: ['Disponível: ', 'Em uso: '],
            datasets: [{
                data: [37, 63],
                backgroundColor: [
                    '#22C55E',
                    '#EF4444',
                ],
                borderWidth: 5,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "48%",
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Uso de CPU',
                        align: 'start',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                        }
                    },
                    // subtitle: {
                    //     display: true,
                    //     text: 'Total de alertas por severidade',
                    //     align: 'start',
                    //     font: {
                    //         size: 18
                    //     },
                    //     padding: {
                    //         bottom: 30,
                    //     }
                    // },
                    tooltip: {
                        enabled: true
                    }
                },
            }
        
    }),

    new Chart(ctxUsoDisco, {
        type: 'doughnut',
        data: {
            labels: ['Disponível: ', 'Em uso: '],
            datasets: [{
                data: [43, 57],
                backgroundColor: [
                    '#22C55E',
                    '#EF4444',
                ],
                borderWidth: 5,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "48%",
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Uso de Disco',
                        align: 'start',
                        font: {
                            size: 18
                        },
                        padding: {
                            top: 10,
                        }
                    },
                    // subtitle: {
                    //     display: true,
                    //     text: 'Total de alertas por severidade',
                    //     align: 'start',
                    //     font: {
                    //         size: 18
                    //     },
                    //     padding: {
                    //         bottom: 30,
                    //     }
                    // },
                    tooltip: {
                        enabled: true
                    }
                },
            }
        
    }),

    new Chart(ctxRamCpu, {
    type: 'bar',
    data: {
        labels: ["04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
        {
            label: 'RAM',
            data: [35, 61, 50, 68, 51],
            backgroundColor: '#244770',
            order: 2
        },
        {
            label: 'CPU',
            data: [45, 52, 70, 73, 37],
            backgroundColor: '#C95050',
            order: 2
        },
    
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Comparando Ram e CPU',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 20,
                    bottom: 30,
                }
            }
        },
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Uso (%)'
            }
        },
        }
    }
    }),

    new Chart(ctxDiskLat, {
    type: 'bar',
    data: {
        labels: ["04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
        {
            label: 'Disco',
            data: [25.5, 40, 48, 51, 38],
            backgroundColor: '#23B26D',
            order: 2
        },
        {
            label: 'Latencia',
            data: [23, 40, 51, 52, 38],
            backgroundColor: '#1D85C2',
            order: 2
        },  
        
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Comparando Disco e Latencia',
                align: 'start',
                font: {
                    size: 18
                },
                padding: {
                    top: 20,
                    bottom: 30,
                }
            }
        },
        responsive: true,
        scales: {
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Uso (%)'
            }
        },
        }
    }
    }),

    new Chart(ctxComponentes, {
        type: 'bar',
        data: {
            labels: [
                'RAM',
                'CPU',
                'DISCO',
                'LATENCIA',
            ],
            datasets: [{
                data: [78, 63, 57, 37],
                backgroundColor: [
                    '#FF1F35',
                    '#FF1F35',
                    '#EAB308',
                    '#45B84E'
                ],
                borderRadius: 6,
                barThickness: 38
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ranking de componentes críticos',
                    align: 'start',
                    color: '#000',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 30
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#E5EAF3',
                        borderDash: [4, 4]
                    }
                },
                y: {
                    grid: {
                        color: '#E5EAF3',
                        borderDash: [4, 4]
                    }
                }
            }
        }
    });

});

function detalhes() {
    window.location = "dashServidorGestor.html"
}

function limparSessao() {
    sessionStorage.clear();
}

new Chart(ctxLatenciaRede, {
    type: 'bar',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'Pacotes enviados    ',
            data: [700, 980, 867, 408, 1098, 640, 580],
            borderColor: '#22C55E',
            backgroundColor: '#8B5CF6',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 1200,
                ticks: {
                    stepSize: 300
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "Pacotes"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

new Chart(ctxMediaDia, {
    type: 'bar',
    data: {
        labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
        datasets: [{
            label: 'RAM',
            data: [60, 30, 44, 82, 54, 76, 32],
            borderColor: '#22C55E',
            backgroundColor: '#F5CC4D',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 10
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "%"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});


new Chart(ctxLatencia, {
    type: 'line',
    data: {
        labels: ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
        datasets: [{
            label: 'Latência (ms)',
            data: [47, 42, 46, 54, 73, 69, 79, 75, 90, 86, 65, 50],
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.5,
            fill: true,
            pointRadius: 3
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
            },
            legend: {
                display: true,
                position: 'bottom'
            },

        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20
                },
                grid: {
                    display: true
                },
                title: {
                    display: true,
                    text: "MS"
                },
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Em uso: ', 'Disponível: '],
        datasets: [{
            data: [88, 22],
            backgroundColor: [
                '#EF4444',
                '#22C55E'
            ],
            borderWidth: 5,
            hoverOffset: 20
        }]
    },
    options: {
        plugins: {
            tille: {
                display: true,
                text: 'Uso de RAM'
            },
            legend: {
                display: true,
                position: 'bottom'
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});