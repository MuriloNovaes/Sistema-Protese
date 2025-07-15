// Função global de navegação
window.navigateTo = function(page) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser && !page.includes('index.html')) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'index.html';
        return false;
    }
    
    // Verifica se a página existe
    fetch(page)
        .then(response => {
            if (response.ok) {
                window.location.href = page;
            } else {
                alert('Página não encontrada');
                console.error('Erro 404:', page);
            }
        })
        .catch(error => {
            alert('Erro ao carregar a página');
            console.error('Erro:', error);
        });
};