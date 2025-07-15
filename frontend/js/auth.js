// auth.js - Versão Corrigida
document.addEventListener('DOMContentLoaded', () => {
    console.log('[AUTH] Sistema de login iniciado');
    
    // Elementos do formulário
    const loginForm = document.getElementById('loginForm');
    const userInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Verificação crítica dos elementos
    if (!loginForm || !userInput || !passwordInput) {
        console.error('[ERRO CRÍTICO] Elementos do formulário não encontrados');
        showError('Erro no sistema. Recarregue a página.');
        return;
    }

    // Limpa qualquer sessão anterior ao carregar a página de login
    localStorage.removeItem('currentUser');

    // Dados de usuários (em produção, usar API)
    const validUsers = [
        { username: 'admin', password: 'senha123', name: 'Administrador' },
        { username: 'dentista', password: 'protese456', name: 'Dr. Silva' }
    ];

    // Configuração dos eventos
    setupFormSubmission();
    setupInputEffects();

    function setupFormSubmission() {
        loginForm.addEventListener('submit', handleSubmit);
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        const username = userInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showError('Preencha todos os campos!');
            return;
        }

        const user = validateUser(username, password);
        
        if (user) {
            handleSuccessfulLogin(user);
        } else {
            handleFailedLogin();
        }
    }

    function validateUser(username, password) {
        return validUsers.find(u => 
            u.username === username && 
            u.password === password
        );
    }

    function handleSuccessfulLogin(user) {
        console.log('[AUTH] Login bem-sucedido para:', user.name);
        
        // Armazenamento seguro dos dados
        const userData = {
            username: user.username,
            name: user.name,
            lastLogin: new Date().toISOString(),
            token: generateSimpleToken(user.username)
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Redirecionamento simples e direto
        window.location.href = 'dashboard.html';
    }

    function handleFailedLogin() {
        showError('Usuário ou senha incorretos');
        passwordInput.value = '';
        passwordInput.focus();
    }

    function generateSimpleToken(username) {
        return btoa(`${username}:${Date.now()}`);
    }

    function showError(message, duration = 3000) {
        // Remove erro anterior se existir
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Estilos básicos
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: #ef4444;
            color: white;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeIn 0.3s;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, duration);
    }

    function setupInputEffects() {
        const inputs = [userInput, passwordInput];
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#38bdf8';
                input.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                input.style.borderColor = '#ccc';
                input.style.boxShadow = 'none';
            });
        });
    }
});

// Função global de logout
window.logout = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
};