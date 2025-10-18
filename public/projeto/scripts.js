import { medicos } from './medicos.js';

function loadMedicos() {
    const medicosGrid = document.querySelector('.medicos');
    medicosGrid.innerHTML = '';  // Limpa antes de carregar

    for (const medico of medicos) {
        const card = createMedicoCard(medico);
        medicosGrid.insertAdjacentHTML('beforeend', card);
    }
    addDeleteFunctionality(); // adiciona os eventos após carregar os cards
}

function createMedicoCard(medico) {
    return `
        <div class="col-md-6 mb-5 position-relative">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <button class="btn-delete btn btn-danger btn-sm position-absolute top-0 end-0 m-2" data-id="${medico.id}" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0v-6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H5h6h2.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3a.5.5 0 0 0-.5.5V4h12v-.5a.5.5 0 0 0-.5-.5h-11z"/>
                    </svg>
                </button>

                <img src="${medico.foto}" 
                    class="card-img-top rounded-top-4 ${medico.nome === 'Dr. José Silva' ? 'jose-png' : ''}"
                    alt="Foto de ${medico.nome}" 
                    onerror="this.src='https://via.placeholder.com/150'" />
                <div class="card-body d-flex flex-column">
                    <p class="card-text"><span class="label">🆔 ID:</span> ${medico.id}</p>
                    <h5 class="card-title">${medico.nome}</h5>
                    <p class="card-text"><span class="label">🩺 Especialidade:</span> ${medico.especialidade}</p>
                    <p class="card-text"><span class="label">📝 Descrição:</span> ${medico.descricao}</p>
                    <p class="card-text"><span class="label">⏰ Disponibilidade:</span> ${medico.horario}</p>
                    <p class="card-text"><span class="label">📞 Telefone:</span> ${medico.telefone ? medico.telefone : 'Não informado'}</p>
                </div>
            </div>
        </div>
    `;
}


function addDeleteFunctionality() {
    const deleteButtons = document.querySelectorAll('.btn-delete');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (confirm('Tem certeza que deseja excluir este médico?')) {
                deleteMedico(id);
            }
        });
    });
}

function deleteMedico(id) {
    const index = medicos.findIndex(m => m.id === id);
    if (index !== -1) {
        medicos.splice(index, 1);
        loadMedicos();  // recarrega a lista atualizada
    }
}

// Inicializa a lista de médicos
loadMedicos();
