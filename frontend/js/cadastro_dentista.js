// cadastro_dentista.js - Versão com Estilo do Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Cores do tema (baseado no dashboard)
    const theme = {
        bg: '#0f172a',
        cardBg: 'rgba(15, 23, 42, 0.95)',
        border: 'rgba(56, 189, 248, 0.2)',
        primary: '#38bdf8',
        primaryHover: '#0ea5e9',
        success: '#10b981',
        error: '#ef4444',
        text: '#e2e8f0',
        textSecondary: '#94a3b8'
    };

    // Elementos do DOM
    const form = document.getElementById('dentistForm');
    const dentistNameInput = document.getElementById('dentistName');
    const clinicNameInput = document.getElementById('clinicName');
    const submitBtn = document.querySelector('.submit-btn');
    
    // Verificação de segurança
    if (!form || !dentistNameInput || !clinicNameInput || !submitBtn) {
        console.error('Elementos do formulário não encontrados!');
        return;
    }

    // Configuração inicial
    setupInputEffects();
    setupFormSubmission();

    // Efeitos nos inputs
    function setupInputEffects() {
        const inputs = [dentistNameInput, clinicNameInput];
        
        inputs.forEach(input => {
            // Efeito de foco
            input.addEventListener('focus', function() {
                this.parentNode.querySelector('.input-icon').style.color = theme.primaryHover;
                this.style.borderColor = theme.primary;
                this.style.boxShadow = `0 0 0 3px rgba(56, 189, 248, 0.3)`;
            });
            
            // Efeito ao sair
            input.addEventListener('blur', function() {
                this.parentNode.querySelector('.input-icon').style.color = theme.primary;
                this.style.borderColor = theme.border;
                this.style.boxShadow = 'none';
            });
            
            // Validação em tempo real
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
    }

    // Configura o envio do formulário
    function setupFormSubmission() {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Desabilita o botão para evitar múltiplos envios
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Cadastrando...';
            submitBtn.style.background = theme.textSecondary;
            
            // Coleta os dados
            const dentistData = {
                nome: dentistNameInput.value.trim(),
                clinica: clinicNameInput.value.trim(),
                dataCadastro: new Date().toISOString(),
                id: generateId()
            };
            
            // Validação
            const isValid = validateForm(dentistData);
            
            if (isValid) {
                try {
                    await saveDentist(dentistData);
                    showSuccess();
                    form.reset();
                } catch (error) {
                    showError('Erro ao salvar. Tente novamente.');
                }
            }
            
            // Reabilita o botão
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-icon">✓</span> Cadastrar Dentista';
                submitBtn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.primaryHover})`;
            }, 2000);
        });
    }

    // Validação de campo individual
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.id === 'dentistName' ? 'Nome do Dentista' : 'Nome da Clínica';
        
        if (value.length > 0 && value.length < 3) {
            field.style.borderColor = '#f59e0b';
            field.parentNode.querySelector('.input-icon').style.color = '#f59e0b';
            return false;
        }
        
        if (value.length >= 3) {
            field.style.borderColor = theme.success;
            field.parentNode.querySelector('.input-icon').style.color = theme.success;
            return true;
        }
        
        field.style.borderColor = theme.border;
        field.parentNode.querySelector('.input-icon').style.color = theme.primary;
        return false;
    }

    // Validação completa do formulário
    function validateForm(data) {
        let isValid = true;
        
        // Valida nome do dentista
        if (data.nome.length < 3) {
            dentistNameInput.style.borderColor = theme.error;
            dentistNameInput.parentNode.querySelector('.input-icon').style.color = theme.error;
            isValid = false;
        }
        
        // Valida nome da clínica
        if (data.clinica.length < 3) {
            clinicNameInput.style.borderColor = theme.error;
            clinicNameInput.parentNode.querySelector('.input-icon').style.color = theme.error;
            isValid = false;
        }
        
        if (!isValid) {
            showError('Preencha todos os campos corretamente!');
            return false;
        }
        
        return true;
    }

    // Salva no localStorage (simulando API)
    function saveDentist(data) {
        return new Promise((resolve, reject) => {
            try {
                let dentists = JSON.parse(localStorage.getItem('dentists')) || [];
                dentists.push(data);
                localStorage.setItem('dentists', JSON.stringify(dentists));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    // Feedback visual de sucesso
    function showSuccess() {
        // Altera o botão
        submitBtn.innerHTML = '<span class="btn-icon">✓</span> Cadastrado com sucesso!';
        submitBtn.style.background = `linear-gradient(135deg, ${theme.success}, #059669)`;
        
        // Cria mensagem flutuante
        const toast = document.createElement('div');
        toast.className = 'form-toast success';
        toast.innerHTML = `
            <span class="toast-icon">✓</span>
            Dentista cadastrado com sucesso!
        `;
        document.body.appendChild(toast);
        
        // Remove após 3 segundos
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Feedback visual de erro
    function showError(message) {
        const errorToast = document.createElement('div');
        errorToast.className = 'form-toast error';
        errorToast.innerHTML = `
            <span class="toast-icon">⚠️</span>
            ${message}
        `;
        document.body.appendChild(errorToast);
        
        setTimeout(() => {
            errorToast.classList.add('fade-out');
            setTimeout(() => errorToast.remove(), 300);
        }, 3000);
    }

    // Gerador de ID simples
    function generateId() {
        return 'dent-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
});