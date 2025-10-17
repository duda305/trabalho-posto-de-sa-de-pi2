import Database from './database.js';

async function up() {
  const db = await Database.connect();

  // ===================== USUÁRIO =====================
  const createUsuario = `
    CREATE TABLE Usuario ( 
      usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(40) NOT NULL,
      email VARCHAR(50) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL,
      data_cadastro DATE DEFAULT (CURRENT_DATE)
    );
  `;

  // ===================== MÉDICO =====================
  const createMedico = `
    CREATE TABLE Medico ( 
      medico_id INTEGER PRIMARY KEY AUTOINCREMENT,
      CRM CHAR(20) UNIQUE NOT NULL,  
      nome VARCHAR(40) NOT NULL,
      disponibilidade VARCHAR(50),
      telefone CHAR(15)
    );
  `;

  // ===================== ESPECIALIDADE =====================
  const createEspecialidade = `
    CREATE TABLE Especialidade ( 
      especialidade_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(30) NOT NULL
    );
  `;

  // ===================== RELAÇÃO MÉDICO–ESPECIALIDADE =====================
  const createTem = `
    CREATE TABLE Tem ( 
      medico_id INTEGER NOT NULL,
      especialidade_id INTEGER NOT NULL,
      PRIMARY KEY (medico_id, especialidade_id),
      FOREIGN KEY (medico_id) REFERENCES Medico(medico_id),
      FOREIGN KEY (especialidade_id) REFERENCES Especialidade(especialidade_id)
    );
  `;

  // ===================== PACIENTE =====================
  const createPaciente = `
    CREATE TABLE Paciente ( 
      paciente_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(40) NOT NULL,
      telefone CHAR(15),  
      cidade VARCHAR(50),
      bairro VARCHAR(50),
      endereco VARCHAR(100),  
      CEP CHAR(15)
    );
  `;

  // ===================== CONSULTA =====================
  const createConsulta = `
    CREATE TABLE Consulta ( 
      consulta_id INTEGER PRIMARY KEY AUTOINCREMENT,
      data_consulta DATE NOT NULL,
      observacao TEXT,
      medico_id INTEGER NOT NULL,
      paciente_id INTEGER NOT NULL,
      FOREIGN KEY (medico_id) REFERENCES Medico(medico_id),
      FOREIGN KEY (paciente_id) REFERENCES Paciente(paciente_id)
    );
  `;

  // ===================== MEDICAMENTO =====================
  const createMedicamento = `
    CREATE TABLE Medicamento ( 
      medicamento_id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(40) NOT NULL,
      fabricante VARCHAR(40),
      data_validade DATE CHECK (data_validade >= CURRENT_DATE)
    );
  `;

  // ===================== PEDIDOS DE MEDICAMENTO =====================
  const createPede = `
    CREATE TABLE Pede ( 
      consulta_id INTEGER NOT NULL,
      medicamento_id INTEGER NOT NULL,
      PRIMARY KEY (consulta_id, medicamento_id),
      FOREIGN KEY (consulta_id) REFERENCES Consulta(consulta_id),
      FOREIGN KEY (medicamento_id) REFERENCES Medicamento(medicamento_id)
    );
  `;

  // ===================== ESTOQUE =====================
  const createEstoque = `
    CREATE TABLE Estoque ( 
      estoque_id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicamento_id INTEGER NOT NULL,
      quantidade INTEGER CHECK (quantidade >= 0),
      FOREIGN KEY (medicamento_id) REFERENCES Medicamento(medicamento_id)
    );
  `;

  // ===================== RELATÓRIO =====================
  const createRelatorio = `
    CREATE TABLE Relatorio ( 
      relatorio_id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo_relatorio CHAR(20),
      arquivo_relatorio VARCHAR(255),
      FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
    );
  `;

  // ===================== NOTIFICAÇÕES =====================
  const createNotificacoes = `
    CREATE TABLE Notificacoes ( 
      notificacao_id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      tipo CHAR(20),
      mensagens TEXT,
      data_envio DATE DEFAULT (CURRENT_DATE),
      status CHAR(10) CHECK (status IN ('Pendente', 'Enviada', 'Lida')),
      FOREIGN KEY (usuario_id) REFERENCES Usuario(usuario_id)
    );
  `;

  // ===================== EXECUÇÃO DAS TABELAS =====================
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