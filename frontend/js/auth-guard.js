// auth-guard.js - Proteção de Rotas
// Inclua este arquivo em todas as páginas protegidas

function checkAuthOnLoad() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redireciona para login se não estiver autenticado
        window.location.href = 'login.html';
        return false;
    }
    
    return currentUser;
}

function setupUserInfoGlobal(user) {
    const welcomeElement = document.querySelector('.user-info span');
    const avatarElement = document.querySelector('.user-avatar');
    
    if (welcomeElement) {
        welcomeElement.textContent = `Bem-vindo, ${user.name}`;
    }
    
    if (avatarElement) {
        avatarElement.textContent = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
}

function setupLogoutGlobal() {
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

// Executa automaticamente quando o script é carregado
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuthOnLoad();
    if (user) {
        setupUserInfoGlobal(user);
        setupLogoutGlobal();
    }
});