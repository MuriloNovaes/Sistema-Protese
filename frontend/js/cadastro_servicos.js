document.addEventListener('DOMContentLoaded', function() {
    const serviceForm = document.getElementById('service-form');
    const serviceSelect = document.getElementById('service');
    const priceListSelect = document.getElementById('price-list');
    const priceInput = document.getElementById('price');

    // Banco de dados de preços para duas listas
    const servicePrices = {
        '1': { // Lista Padrão
            'Coroa em Zircônia': '450.00',
            'Faceta em Cerâmica': '650.00',
            'Prótese Total': '1200.00',
            'Prótese Parcial': '850.00',
            'Onlay/Inlay': '550.00'
        },
        '2': { // Lista Especial
            'Coroa em Zircônia': '380.00',
            'Faceta em Cerâmica': '580.00',
            'Prótese Total': '1000.00',
            'Prótese Parcial': '720.00',
            'Onlay/Inlay': '480.00'
        }
    };

    // Define a data atual como padrão
    document.getElementById('receipt-date').valueAsDate = new Date();

    // Atualiza preço quando serviço ou lista é alterada
    function updatePrice() {
        const selectedService = serviceSelect.value;
        const selectedPriceList = priceListSelect.value;
        
        if (selectedService && selectedPriceList && servicePrices[selectedPriceList][selectedService]) {
            priceInput.value = servicePrices[selectedPriceList][selectedService];
        } else {
            priceInput.value = '';
        }
    }

    serviceSelect.addEventListener('change', updatePrice);
    priceListSelect.addEventListener('change', updatePrice);

    // Validação do formulário
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validações existentes...
        const toothNumber = document.getElementById('tooth-number').value;
        if (toothNumber < 1 || toothNumber > 48) {
            alert('Número do dente inválido. Deve ser entre 1 e 48.');
            return;
        }

        const receiptDateInput = document.getElementById('receipt-date');
        const receiptDate = new Date(receiptDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!receiptDateInput.value) {
            alert('Por favor, selecione a data de recebimento!');
            return;
        }
        
        if (receiptDate > today) {
            alert('A data de recebimento não pode ser futura!');
            return;
        }

        // Coleta todos os dados do formulário (incluindo lista de preços)
        const formData = {
            clinic: document.getElementById('clinic').value,
            dentist: document.getElementById('dentist').value,
            patient: document.getElementById('patient').value,
            service: serviceSelect.value,
            priceList: priceListSelect.value, // Nova informação
            price: priceInput.value,
            toothColor: document.getElementById('tooth-color').value,
            toothNumber: toothNumber,
            quantity: document.getElementById('quantity').value,
            receiptDate: receiptDateInput.value,
            status: 'pending',
            notes: ''
        };

        // Armazenamento no localStorage
        let services = JSON.parse(localStorage.getItem('prosthesis_services')) || [];
        services.push({
            ...formData,
            id: Date.now().toString()
        });
        localStorage.setItem('prosthesis_services', JSON.stringify(services));

        // Feedback e reset
        alert('Serviço cadastrado com sucesso!');
        serviceForm.reset();
        priceInput.value = '';
        priceListSelect.value = '';
        document.getElementById('receipt-date').valueAsDate = new Date();
    });

    // Restante do código permanece igual...
});