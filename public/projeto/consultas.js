// Função para carregar consultas
async function loadConsultas() {
    try {
        const response = await fetch('/api/consultas');
        const consultas = await response.json();

        const consultasGrid = document.querySelector('.consultas');
        consultasGrid.innerHTML = '';

        consultas.forEach(consulta => {
            const card = createConsultaCard(consulta);
            consultasGrid.insertAdjacentHTML('beforeend', card);
        });
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        alert('Erro ao carregar consultas');
    }
}

// Função para criar o card da consulta
function createConsultaCard(consulta) {
    return `
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${consulta.medico.nome}</h5>
                    <p class="card-text">Paciente: ${consulta.paciente.nome}</p>
                    <p class="card-text">Data: ${new Date(consulta.data_consulta).toLocaleDateString('pt-BR')}</p>
                    <p class="card-text">Observações: ${consulta.observacao}</p>
                </div>
            </div>
        </div>
    `;
}

// Carregar consultas ao carregar a página
document.addEventListener('DOMContentLoaded', loadConsultas);
