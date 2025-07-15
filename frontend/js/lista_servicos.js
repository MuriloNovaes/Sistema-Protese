document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const servicesListBody = document.getElementById('services-list-body');
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const clinicFilter = document.getElementById('clinic-filter');
    const dateFilter = document.getElementById('date-filter');
    const dateRange = document.getElementById('date-range');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const filterBtn = document.getElementById('filter-btn');
    const filtersContainer = document.getElementById('filters-container');
    const serviceDetailsModal = document.getElementById('service-details-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    const markAsPendingBtn = document.getElementById('mark-as-pending');
    const markAsCompletedBtn = document.getElementById('mark-as-completed');
    const markAsDeliveredBtn = document.getElementById('mark-as-delivered');
    const deliveryModal = document.getElementById('delivery-modal');
    const closeDeliveryModalBtn = document.getElementById('close-delivery-modal');
    const cancelDeliveryBtn = document.getElementById('cancel-delivery');
    const confirmDeliveryBtn = document.getElementById('confirm-delivery');
    const deliveryDateInput = document.getElementById('delivery-date');

    // Variável para armazenar o serviço selecionado
    let selectedService = null;

    // Carregar serviços do localStorage ou usar array vazio
    let services = JSON.parse(localStorage.getItem('prosthesis_services')) || [];

    // Mostrar/ocultar filtros
    filterBtn.addEventListener('click', function() {
        filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Mostrar/ocultar date range
    dateFilter.addEventListener('change', function() {
        dateRange.style.display = this.value === 'custom' ? 'flex' : 'none';
    });

    // Carregar lista de serviços
    function loadServices() {
        servicesListBody.innerHTML = '';
        
        // Aplicar filtros
        let filteredServices = [...services];
        
        // Filtro por status
        if (statusFilter.value !== 'all') {
            filteredServices = filteredServices.filter(service => service.status === statusFilter.value);
        }
        
        // Filtro por clínica
        if (clinicFilter.value !== 'all') {
            filteredServices = filteredServices.filter(service => service.clinic === clinicFilter.value);
        }
        
        // Filtro por data
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (dateFilter.value === 'today') {
            filteredServices = filteredServices.filter(service => {
                const serviceDate = new Date(service.receiptDate);
                return serviceDate.toDateString() === today.toDateString();
            });
        } else if (dateFilter.value === 'week') {
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay());
            
            filteredServices = filteredServices.filter(service => {
                const serviceDate = new Date(service.receiptDate);
                return serviceDate >= firstDayOfWeek;
            });
        } else if (dateFilter.value === 'month') {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            
            filteredServices = filteredServices.filter(service => {
                const serviceDate = new Date(service.receiptDate);
                return serviceDate >= firstDayOfMonth;
            });
        } else if (dateFilter.value === 'custom' && startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            end.setHours(23, 59, 59, 999);
            
            filteredServices = filteredServices.filter(service => {
                const serviceDate = new Date(service.receiptDate);
                return serviceDate >= start && serviceDate <= end;
            });
        }
        
        // Filtro por busca
        if (searchInput.value) {
            const searchTerm = searchInput.value.toLowerCase();
            filteredServices = filteredServices.filter(service => 
                service.patient.toLowerCase().includes(searchTerm) || 
                service.dentist.toLowerCase().includes(searchTerm) ||
                service.service.toLowerCase().includes(searchTerm) ||
                (service.clinic && service.clinic.toLowerCase().includes(searchTerm))
            );
        }
        
        // Ordenar por data (mais recente primeiro)
        filteredServices.sort((a, b) => new Date(b.receiptDate) - new Date(a.receiptDate));
        
        // Exibir serviços
        if (filteredServices.length === 0) {
            servicesListBody.innerHTML = `
                <div class="no-results">
                    <span class="material-icons">info</span>
                    <p>Nenhum serviço encontrado</p>
                </div>
            `;
            return;
        }
        
        filteredServices.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            
            // Formatar data de recebimento
            const receiptDate = new Date(service.receiptDate);
            const formattedReceiptDate = receiptDate.toLocaleDateString('pt-BR');
            
            // Formatar data de entrega (corrigido para evitar problemas de timezone)
            let formattedDeliveryDate = '-';
            if (service.deliveryDate) {
                const [year, month, day] = service.deliveryDate.split('-');
                formattedDeliveryDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
            }
            
            // Status badge
            let statusBadge = '';
            if (service.status === 'pending') {
                statusBadge = '<div class="status-badge status-pending">Pendente</div>';
            } else if (service.status === 'completed') {
                statusBadge = '<div class="status-badge status-completed">Concluído</div>';
            } else {
                statusBadge = '<div class="status-badge status-delivered">Entregue</div>';
            }
            
            serviceItem.innerHTML = `
                <div>${index + 1}</div>
                <div>${service.dentist || 'Não informado'}</div>
                <div>${service.clinic || 'N/D'}</div>
                <div>${service.patient}</div>
                <div>${service.service}</div>
                <div>${service.toothNumber} (${service.toothColor})</div>
                <div>${formattedReceiptDate}</div>
                <div class="delivery-date">${formattedDeliveryDate}</div>
                <div>${statusBadge}</div>
                <div class="action-buttons">
                    <button class="action-btn view-btn" data-id="${service.id}">
                        <span class="material-icons">visibility</span>
                        <span class="desktop-text">Visualizar</span>
                    </button>
                    <button class="action-btn edit-btn" data-id="${service.id}">
                        <span class="material-icons">edit</span>
                        <span class="desktop-text">Editar</span>
                    </button>
                </div>
            `;
            
            servicesListBody.appendChild(serviceItem);
        });
        
        // Adicionar eventos aos botões
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-id');
                showServiceDetails(serviceId);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const serviceId = this.getAttribute('data-id');
                editService(serviceId);
            });
        });
    }
    
    // Mostrar detalhes do serviço
    function showServiceDetails(serviceId) {
        selectedService = services.find(service => service.id === serviceId);
        
        if (!selectedService) return;
        
        // Formatar data de recebimento
        const receiptDate = new Date(selectedService.receiptDate);
        const formattedReceiptDate = receiptDate.toLocaleDateString('pt-BR');
        
        // Formatar data de entrega (corrigido para evitar problemas de timezone)
        let formattedDeliveryDate = 'Não entregue';
        if (selectedService.deliveryDate) {
            const [year, month, day] = selectedService.deliveryDate.split('-');
            formattedDeliveryDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }
        
        modalBody.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">Dentista:</div>
                <div class="detail-value">${selectedService.dentist || 'Não informado'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Clínica:</div>
                <div class="detail-value">${selectedService.clinic || 'Não informada'}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Paciente:</div>
                <div class="detail-value">${selectedService.patient}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Serviço:</div>
                <div class="detail-value">${selectedService.service}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Preço:</div>
                <div class="detail-value">R$ ${selectedService.price}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Dente:</div>
                <div class="detail-value">${selectedService.toothNumber} (${selectedService.toothColor})</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Quantidade:</div>
                <div class="detail-value">${selectedService.quantity}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Data de Entrada:</div>
                <div class="detail-value">${formattedReceiptDate}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Data de Entrega:</div>
                <div class="detail-value">${formattedDeliveryDate}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status:</div>
                <div class="detail-value">
                    ${selectedService.status === 'pending' ? 'Pendente' : 
                      selectedService.status === 'completed' ? 'Concluído' : 'Entregue'}
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Observações:</div>
                <div class="detail-value">${selectedService.notes || 'Nenhuma observação'}</div>
            </div>
        `;
        
        // Mostrar modal
        serviceDetailsModal.style.display = 'flex';
    }
    
    // Fechar modais
    closeModalBtn.addEventListener('click', function() {
        serviceDetailsModal.style.display = 'none';
    });
    
    closeDeliveryModalBtn.addEventListener('click', function() {
        deliveryModal.style.display = 'none';
    });
    
    cancelDeliveryBtn.addEventListener('click', function() {
        deliveryModal.style.display = 'none';
    });
    
    // Atualizar status do serviço
    markAsPendingBtn.addEventListener('click', function() {
        if (!selectedService) return;
        
        selectedService.status = 'pending';
        selectedService.deliveryDate = null;
        updateService(selectedService);
        serviceDetailsModal.style.display = 'none';
        loadServices();
    });
    
    markAsCompletedBtn.addEventListener('click', function() {
        if (!selectedService) return;
        
        selectedService.status = 'completed';
        selectedService.deliveryDate = null;
        updateService(selectedService);
        serviceDetailsModal.style.display = 'none';
        loadServices();
    });
    
    markAsDeliveredBtn.addEventListener('click', function() {
        if (!selectedService) return;
        
        // Mostrar modal para data de entrega
        const today = new Date();
        deliveryDateInput.valueAsDate = today;
        deliveryModal.style.display = 'flex';
    });
    
    // Confirmar entrega (com correção para o problema do timezone)
    confirmDeliveryBtn.addEventListener('click', function() {
        if (!selectedService || !deliveryDateInput.value) {
            alert('Por favor, selecione a data de entrega!');
            return;
        }

        // Obter a data no formato YYYY-MM-DD
        const deliveryDateStr = deliveryDateInput.value;
        
        // Converter para objeto Date no UTC para comparação
        const [year, month, day] = deliveryDateStr.split('-');
        const deliveryDateUTC = new Date(Date.UTC(year, month - 1, day));
        const receiptDate = new Date(selectedService.receiptDate);
        
        // Comparação de datas
        if (deliveryDateUTC < receiptDate) {
            alert('A data de entrega não pode ser anterior à data de entrada!');
            return;
        }
        
        // Armazenar a data no formato YYYY-MM-DD (sem problemas de timezone)
        selectedService.status = 'delivered';
        selectedService.deliveryDate = deliveryDateStr;
        updateService(selectedService);
        deliveryModal.style.display = 'none';
        serviceDetailsModal.style.display = 'none';
        loadServices();
    });
    
    // Atualizar serviço no localStorage
    function updateService(updatedService) {
        const index = services.findIndex(service => service.id === updatedService.id);
        if (index !== -1) {
            services[index] = updatedService;
            localStorage.setItem('prosthesis_services', JSON.stringify(services));
        }
    }
    
    // Editar serviço
    function editService(serviceId) {
        window.location.href = `cadastro_servicos.html?edit=${serviceId}`;
    }
    
    // Event listeners para filtros
    searchInput.addEventListener('input', loadServices);
    statusFilter.addEventListener('change', loadServices);
    clinicFilter.addEventListener('change', loadServices);
    dateFilter.addEventListener('change', loadServices);
    startDate.addEventListener('change', loadServices);
    endDate.addEventListener('change', loadServices);
    
    // Fechar modais ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === serviceDetailsModal) {
            serviceDetailsModal.style.display = 'none';
        }
        if (event.target === deliveryModal) {
            deliveryModal.style.display = 'none';
        }
    });
    
    // Definir datas padrão para o filtro
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    startDate.valueAsDate = firstDayOfMonth;
    endDate.valueAsDate = today;
    
    // Botão de voltar para o dashboard
    const backButton = document.createElement('a');
    backButton.href = 'dashboard.html';
    backButton.className = 'back-button';
    backButton.innerHTML = `
        <span class="material-icons">arrow_back</span>
        Voltar ao Dashboard
    `;
    
    // Botão de exportação
    const exportButton = document.createElement('button');
    exportButton.className = 'export-button';
    exportButton.innerHTML = `
        <span class="material-icons">description</span>
        Exportar
    `;
    exportButton.addEventListener('click', function() {
        alert('Funcionalidade de exportação será implementada no backend');
    });
    
    // Container para os botões
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'action-buttons-container';
    buttonsContainer.appendChild(backButton);
    buttonsContainer.appendChild(exportButton);
    
    // Adiciona o container no header
    const header = document.querySelector('.services-header');
    header.appendChild(buttonsContainer);
    
    // Estilo para os botões
    const style = document.createElement('style');
    style.textContent = `
        .action-buttons-container {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            background: rgba(148, 163, 184, 0.1);
            border: 1px solid var(--border);
            padding: 10px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
            text-decoration: none;
        }
        
        .back-button:hover {
            color: var(--primary);
            border-color: var(--primary);
            background: rgba(56, 189, 248, 0.1);
        }
        
        .export-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--text);
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            padding: 10px 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
        }
        
        .export-button:hover {
            background: rgba(16, 185, 129, 0.2);
        }
        
        .export-button .material-icons {
            color: var(--success);
        }
        
        .delivery-date {
            font-size: 13px;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
    
    // Carregar serviços ao iniciar
    loadServices();
});