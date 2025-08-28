import { medicos } from './medicos.js';

function loadMedicos() {
    const medicosGrid = document.querySelector('.medicos'); // ou '.medico' dependendo do que corrigir no HTML
    
    for (const medico of medicos) {
        const card = createMedicoCard(medico);
        medicosGrid.insertAdjacentHTML('beforeend', card);
    }
}

function createMedicoCard(medico) {
    return ` 
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <img src="${medico.foto}" 
                     class="card-img-top rounded-top-4" 
                     alt="Foto de ${medico.nome}" 
                     onerror="this.src='https://via.placeholder.com/150'" />
                <div class="card-body d-flex flex-column">
                    <p class="card-text">ID: ${medico.id}</p>
                    <h5 class="card-title">${medico.nome}</h5>
                    <p class="card-text">Especialidade: ${medico.especialidade}</p>
                    <p class="card-text">Disponibilidade: ${medico.horario}</p>
                    <p class="card-text">Telefone: ${medico.telefone ? medico.telefone : 'Não informado'}</p>
                </div>
            </div>
        </div>
    `;
}

loadMedicos();