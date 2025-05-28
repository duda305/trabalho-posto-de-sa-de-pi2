import { medicos } from "./medicos.js"

const medicosGrid = document.querySelector('.medicos')

function createMedicoCard(medico) {
    return ` 
        <div class="col-md-6 mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4">
                <img src="${medico.foto}" 
                     class="card-img-top rounded-top-4" 
                     alt="Foto de ${medico.nome}" 
                     onerror="this.src='https://via.placeholder.com/150'" />
                <div class="card-body d-flex flex-column">
                    <p class="card-text">${medico.id}</p>
                    <h5 class="card-title">${medico.nome}</h5>
                    <p class="card-text">Especialidade: ${medico.especialidade}</p>
                    <p class="card-text">${medico.descricao}</p>
                    <p class="card-text">${medico.horario}</p>
                </div>
            </div>
        </div>
    `
}

for (const medico of medicos) {
    const card = createMedicoCard(medico);
    medicosGrid.insertAdjacentHTML('beforeend', card)
}
