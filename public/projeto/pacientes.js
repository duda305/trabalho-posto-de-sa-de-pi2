// Função para carregar pacientes
async function loadPacientes() {
    try {
        const response = await fetch('/api/pacientes');
        const pacientes = await response.json();

        const pacientesGrid = document.querySelector('.pacientes');
        pacientesGrid.innerHTML = '';

        pacientes.forEach(paciente => {
            const card = createPacienteCard(paciente);
            pacientesGrid.insertAdjacentHTML('beforeend', card);
        });
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        alert('Erro ao carregar pacientes');
    }
}

// Função para criar o card do paciente
function createPacienteCard(paciente) {
    return `
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${paciente.nome}</h5>
                    <p class="card-text">Telefone: ${paciente.telefone}</p>
                    <p class="card-text">Endereço: ${paciente.endereco}</p>
                    <p class="card-text">Cidade: ${paciente.cidade}</p>
                </div>
            </div>
        </div>
    `;
}

// Carregar pacientes ao carregar a página
document.addEventListener('DOMContentLoaded', loadPacientes);
