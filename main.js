 // Loop para exibir médicos na página
        const container = document.getElementById("lista-medicos");

        medicosDisponiveis.forEach(medico => {
            const div = document.createElement("div");
            div.className = "medico";
            div.innerHTML = `
                <strong>Nome:</strong> ${medico.nome} <br>
                <strong>Especialidade:</strong> ${medico.especialidade} <br>
                <strong>Horário:</strong> ${medico.horario}
            `;
            container.appendChild(div);
        });
