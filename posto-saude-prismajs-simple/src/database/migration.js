import Database from './database.js';

async function up() {
    const db = await Database.connect();

    const createUsuario = `
      CREATE TABLE Usuario ( 
       usuario_id      INTEGER NOT NULL,
       nome           VARCHAR(40),
       email          VARCHAR(50),
       senha          VARCHAR(255),
       data_cadastro  DATE);
    `;

    const createMedico = `
    CREATE TABLE Medico ( 
       medico_id      INTEGER NOT NULL,
       CRM           CHAR(20) UNIQUE,  
       nome          VARCHAR(40),
       disponibilidade VARCHAR(50),
       telefone      CHAR(15));
    `;

    const createEspecialidade = `
    CREATE TABLE Especialidade ( 
      especialidade_id INTEGER NOT NULL PRIMARY KEY,
      nome VARCHAR(30)
    );
    `;

    const createTem = `
    CREATE TABLE Tem ( 
      medico_id INTEGER NOT NULL,
      especialidade_id INTEGER NOT NULL,
      PRIMARY KEY (medico_id, especialidade_id),
      FOREIGN KEY (medico_id) REFERENCES Medico(medico_id),
      FOREIGN KEY (especialidade_id) REFERENCES Especialidade(especialidade_id)
    );
    `;

    const createPaciente = `
    CREATE TABLE Paciente ( 
      paciente_id INTEGER NOT NULL PRIMARY KEY,
      nome VARCHAR(40),
      telefone CHAR(15),  
      cidade VARCHAR(50),
      bairro VARCHAR(50),
      endereco VARCHAR(100),  
      CEP CHAR(15)
    );
    `;

    const createConsulta = `
    CREATE TABLE Consulta ( 
      consulta_id INTEGER NOT NULL PRIMARY KEY,
      data_consulta DATE,
      observacao TEXT,
      medico_id INTEGER,
      paciente_id INTEGER,
      FOREIGN KEY (medico_id) REFERENCES Medico(medico_id),
      FOREIGN KEY (paciente_id) REFERENCES Paciente(paciente_id)
    );
    `;

    const createPede = `
    CREATE TABLE Pede ( 
      consulta_id INTEGER NOT NULL,
      medicamento_id INTEGER NOT NULL,
      PRIMARY KEY (consulta_id, medicamento_id),
      FOREIGN KEY (consulta_id) REFERENCES Consulta(consulta_id),
      FOREIGN KEY (medicamento_id) REFERENCES Medicamento(medicamento_id)
    );
    `;

    const createMedicamento = `
    CREATE TABLE Medicamento ( 
      medicamento_id INTEGER NOT NULL PRIMARY KEY,
      nome VARCHAR(40),
      fabricante VARCHAR(40),
      data_validade DATE
    );
    `;

    const createEstoque = `
    CREATE TABLE Estoque ( 
      estoque_id INTEGER NOT NULL PRIMARY KEY,
      medicamento_id INTEGER NOT NULL,
      quantidade INTEGER CHECK (quantidade >= 0),
      FOREIGN KEY (medicamento_id) REFERENCES Medicamento(medicamento_id)
    );
    `;

    const createRelatorio = `
    CREATE TABLE Relatorio ( 
      relatorio_id INTEGER NOT NULL PRIMARY KEY,
      usuario_id INTEGER,
      tipo_relatorio CHAR(20),
      arquivo_relatorio VARCHAR(255),
      FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
    );
    `;

    const createNotificacoes = `
    CREATE TABLE Notificacoes ( 
      notificacao_id INTEGER NOT NULL PRIMARY KEY,
      usuario_id INTEGER,
      tipo CHAR(20),
      mensagens TEXT,
      data_envio DATE,
      status CHAR(10) CHECK (status IN ('Pendente', 'Enviada', 'Lida')),
      FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
    );
    `;

    await db.run(createUsuario);
    await db.run(createMedico);
    await db.run(createEspecialidade);
    await db.run(createTem);
    await db.run(createPaciente);
    await db.run(createConsulta);
    await db.run(createMedicamento);
    await db.run(createPede);
    await db.run(createEstoque);
    await db.run(createRelatorio);
    await db.run(createNotificacoes);
}


export default { up };