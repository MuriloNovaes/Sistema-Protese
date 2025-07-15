document.addEventListener('DOMContentLoaded', function() {
    // Dados mockados para laboratório de prótese
    const revenueData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [{
            label: '',
            data: [12500, 14200, 15800, 17200, 16500, 18750],
            backgroundColor: 'rgba(56, 189, 248, 0.7)',
            borderColor: 'rgba(56, 189, 248, 0.9)',
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    // Configuração do gráfico minimalista
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: revenueData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `R$ ${context.parsed.y.toLocaleString('pt-BR')}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(56, 189, 248, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return `R$ ${value/1000}k`;
                        }
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de serviços
    const servicesData = {
        labels: ['Coroa Dentária', 'Ponte Fixa', 'Prótese Total', 'Facetas'],
        datasets: [{
            label: 'Serviços Entregues',
            data: [18, 12, 8, 4],
            backgroundColor: [
                'rgba(56, 189, 248, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(139, 92, 246, 0.7)'
            ],
            borderWidth: 0
        }]
    };

    const servicesCtx = document.getElementById('servicesChart').getContext('2d');
    const servicesChart = new Chart(servicesCtx, {
        type: 'doughnut',
        data: servicesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed} serviços`;
                        }
                    }
                }
            }
        }
    });

    // Alternar entre gráfico de barras e linha
    document.getElementById('bar-chart-btn').addEventListener('click', function() {
        revenueChart.config.type = 'bar';
        revenueChart.update();
    });

    document.getElementById('line-chart-btn').addEventListener('click', function() {
        revenueChart.config.type = 'line';
        revenueChart.update();
    });

    // Atualizar dados
    document.getElementById('refresh-btn').addEventListener('click', function() {
        // Atualizar faturamento
        const newRevenue = revenueChart.data.datasets[0].data.map(value => {
            return Math.floor(Math.random() * 5000) + 12000;
        });
        revenueChart.data.datasets[0].data = newRevenue;
        revenueChart.update();
        
        // Atualizar serviços
        const newServices = servicesChart.data.datasets[0].data.map(value => {
            return Math.floor(Math.random() * 5) + 5;
        });
        servicesChart.data.datasets[0].data = newServices;
        servicesChart.update();
        
        // Feedback visual
        const btn = document.getElementById('refresh-btn');
        btn.innerHTML = '<span class="material-icons">check</span> Atualizado';
        setTimeout(() => {
            btn.innerHTML = '<span class="material-icons">refresh</span> Atualizar';
        }, 2000);
    });
});