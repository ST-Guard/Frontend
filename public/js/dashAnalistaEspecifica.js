function fnNavegar(local) {
    window.location.href = local
}

const ctx = document.getElementById('graficoDonut');

const ctxLatencia = document.getElementById('graficoLatencia');

const ctxMediaDia = document.getElementById('graficoMediaDia');

const ctxLatenciaRede = document.getElementById('graficoLatenciaRede');


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