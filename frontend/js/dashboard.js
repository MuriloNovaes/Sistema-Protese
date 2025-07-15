// dashboard.js - Versão Corrigida
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DASHBOARD] Iniciando dashboard...');
    
    // Verifica autenticação PRIMEIRO
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('[DASHBOARD] Usuário não autenticado, redirecionando...');
        window.location.href = 'login.html';
        return;
    }

    console.log('[DASHBOARD] Usuário autenticado:', currentUser.name);
    
    // Dados simulados para demonstração
    const dashboardData = {
        stats: {
            servicosMes: 35,
            faturamento: 15250,
            pendentes: 8,
            dentistas: 12
        },
        recentActivities: [
            {
                icon: 'completed',
                title: 'Coroa de Porcelana finalizada',
                time: 'Há 2 horas - Dr. Silva'
            },
            {
                icon: 'new',
                title: 'Novo serviço cadastrado',
                time: 'Há 4 horas - Dra. Santos'
            },
            {
                icon: 'warning',
                title: 'Prazo próximo do vencimento',
                time: 'Há 6 horas - Implante Dr. Costa'
            },
            {
                icon: 'user',
                title: 'Novo dentista cadastrado',
                time: 'Há 1 dia - Dr. Oliveira'
            }
        ]
    };

    // Inicializa o dashboard
    initDashboard();

    function initDashboard() {
        console.log('[DASHBOARD] Configurando interface...');
        
        // Configura informações do usuário
        setupUserInfo(currentUser);
        setupLogout();
        
        // Atualiza dados do dashboard
        updateStats();
        setTimeout(animateNumbers, 500);
        
        // Configura navegação
        setupNavigation();
        setupQuickActions();
        
        // Mensagem de boas-vindas
        setTimeout(() => {
            showMessage('Dashboard carregado com sucesso!', 'success');
        }, 1000);
    }

    function setupUserInfo(user) {
        const welcomeElement = document.querySelector('.user-info span');
        const avatarElement = document.querySelector('.user-avatar');
        
        if (welcomeElement) {
            welcomeElement.textContent = `Bem-vindo, ${user.name}`;
        }
        
        if (avatarElement) {
            avatarElement.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        }
    }

    function setupLogout() {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Tem certeza que deseja sair?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                }
            });
        }
    }

    function updateStats() {
        const stats = dashboardData.stats;
        const statCards = document.querySelectorAll('.stat-card');
        
        if (statCards.length >= 4) {
            statCards[0].querySelector('.stat-number').textContent = stats.servicosMes;
            statCards[1].querySelector('.stat-number').textContent = formatCurrency(stats.faturamento);
            statCards[2].querySelector('.stat-number').textContent = stats.pendentes;
            statCards[3].querySelector('.stat-number').textContent = stats.dentistas;
        }
    }

    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(number => {
            if (number.textContent.includes('R$')) return;
            
            const finalNumber = parseInt(number.textContent);
            let currentNumber = 0;
            const increment = finalNumber / 30;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    number.textContent = finalNumber;
                    clearInterval(timer);
                } else {
                    number.textContent = Math.floor(currentNumber);
                }
            }, 50);
        });
    }

    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        // Mapeamento de páginas
        const pageMap = {
            'Dashboard': 'dashboard.html',
            'Cadastro de dentista': 'cadastro_dentista.html',
            'Cadastro de Serviços': 'cadastro_servico.html',
            'Lista de Serviços': 'lista_servicos.html',
            'Relatórios': 'relatorios.html'
        };

        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const pageName = this.textContent.trim();
                const pageUrl = pageMap[pageName];
                
                if (pageUrl) {
                    // Remove classe active de todos
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    // Adiciona active no clicado
                    this.classList.add('active');
                    
                    // Navega para a página
                    if (pageUrl !== 'dashboard.html') {
                        window.location.href = pageUrl;
                    }
                }
            });
        });
    }

    function setupQuickActions() {
        const actions = {
            'Novo Serviço': 'cadastro_servico.html',
            'Novo Dentista': 'cadastro_dentista.html',
            'Ver Relatórios': 'relatorios.html'
        };

        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('.action-title').textContent;
                
                // Efeito visual
                this.style.transform = 'scale(0.95)';
                setTimeout(() => this.style.transform = '', 150);
                
                // Redirecionamento
                if (actions[title]) {
                    setTimeout(() => {
                        window.location.href = actions[title];
                    }, 200);
                }
            });
        });
    }

    // Funções utilitárias
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message-toast ${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 3000);
    }
});