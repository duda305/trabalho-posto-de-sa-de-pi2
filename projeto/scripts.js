// Função para carregar os médicos do arquivo JSON
function carregarMedicos() {
    const loader = document.getElementById('loader');
    const medicosContainer = document.getElementById('medicos-container');

    // Exibe o loader enquanto os dados estão sendo carregados
    loader.style.display = 'flex';

    // Carregar os dados do arquivo JSON
    fetch('medicos.json')
        .then(response => response.json())
        .then(data => {
            // Limpar o conteúdo existente
            medicosContainer.innerHTML = '';

            // Exibir os médicos na tela
            data.forEach(medico => {
                const medicoCard = `
                    <div class="col-md-4">
                        <div class="medico-card">
                            <img src="${medico.foto}" alt="${medico.nome}">
                            <h3>${medico.nome}</h3>
                            <p><strong>Especialidade:</strong> ${medico.especialidade}</p>
                            <p>${medico.descricao}</p>
                            <button class="btn btn-primary" onclick="agendarConsulta('${medico.nome}')">Agendar Consulta</button>
                        </div>
                    </div>
                `;
                medicosContainer.innerHTML += medicoCard;
            });

            // Esconde o loader após o carregamento
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Erro ao carregar os médicos:', error);
            loader.style.display = 'none';
        });
}

// Função para exibir os médicos
function mostrarTela(tela) {
    document.querySelectorAll('.tela').forEach(t => t.style.display = 'none');
    if (tela === 'medicos') {
        carregarMedicos(); // Carregar médicos ao exibir tela
    }
    document.getElementById(tela).style.display = 'block';
}

// Função para agendar consulta
function agendarConsulta(nomeMedico) {
    alert(`Consulta agendada com o médico ${nomeMedico}`);
}
