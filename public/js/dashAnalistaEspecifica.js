document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('chartusomedio');

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
})
