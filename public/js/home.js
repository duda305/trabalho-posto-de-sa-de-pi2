import API from './services/api.js';
import Auth from './lib/auth.js';
import { formatDate } from './lib/format.js';

let removedAppointmentId;

const form = document.querySelector('#agendarConsulta');
const bsOffcanvas = new bootstrap.Offcanvas('#offcanvasConsulta');
const confirmModal = new bootstrap.Modal('.modal');

function AppointmentCard(appointment) {
  return `
    <div class="col" id="appointment-${appointment.id}">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${appointment.medico}</h5>
          <p class="card-text">
            <strong>Paciente:</strong> ${appointment.paciente}<br />
            <strong>Data:</strong> ${formatDate(appointment.data_consulta)}<br />
            <strong>Observações:</strong> ${appointment.observacao || 'Nenhuma'}
          </p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-warning icon-pencil">Editar</button>
            <button class="btn btn-sm btn-danger icon-trash">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createAppointmentCard(appointment) {
  document.querySelector('#appointments').insertAdjacentHTML(
    'beforeend',
    AppointmentCard(appointment)
  );

  loadHandleConfirmModal(appointment.id);
  loadHandleUpdateAppointment(appointment.id);
}

function updateAppointmentCard(appointment) {
  const card = document.querySelector(`#appointment-${appointment.id}`);
  card.querySelector('.card-title').innerText = appointment.medico;
  card.querySelector('.card-text').innerHTML = `
    <strong>Paciente:</strong> ${appointment.paciente}<br />
    <strong>Data:</strong> ${formatDate(appointment.data_consulta)}<br />
    <strong>Observações:</strong> ${appointment.observacao || 'Nenhuma'}
  `;
}

function loadHandleFormSubmit(type, id) {
  form.onsubmit = async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    if (type === 'create') {
      const created = await API.create('/consultas', data);
      createAppointmentCard(created);
    } else if (type === 'update') {
      const updated = await API.update(`/consultas/${id}`, data);
      updateAppointmentCard(updated);
    }

    form.reset();
    bsOffcanvas.hide();
  };
}

function loadHandleCreateAppointment() {
  const button = document.querySelector('.btn.create-investment'); // ou btn-primary
  if (button) {
    button.onclick = () => {
      form.reset();
      loadHandleFormSubmit('create');
      bsOffcanvas.show();
    };
  }
}

function loadHandleUpdateAppointment(id) {
  const card = document.querySelector(`#appointment-${id}`);
  const editBtn = card.querySelector('.icon-pencil');

  editBtn.onclick = async () => {
    const appointment = await API.read(`/consultas/${id}`);

    document.querySelector('#paciente').value = appointment.paciente;
    document.querySelector('#medico').value = appointment.medico;
    document.querySelector('#data_consulta').value = formatDate(appointment.data_consulta, 'ymd');
    document.querySelector('#observacao').value = appointment.observacao;

    bsOffcanvas.show();
    loadHandleFormSubmit('update', id);
  };
}

function loadHandleConfirmModal(id) {
  const card = document.querySelector(`#appointment-${id}`);
  const deleteBtn = card.querySelector('.icon-trash');

  deleteBtn.onclick = () => {
    removedAppointmentId = id;
    confirmModal.show();
  };
}

function loadHandleRemoveAppointment() {
  const confirmBtn = document.querySelector('.modal .btn-primary');

  confirmBtn.onclick = async () => {
    await API.remove(`/consultas/${removedAppointmentId}`);
    document.querySelector(`#appointment-${removedAppointmentId}`).remove();
    confirmModal.hide();
  };
}

async function loadAppointments() {
  const appointments = await API.read('/consultas');
  for (const appointment of appointments) {
    createAppointmentCard(appointment);
  }
}

async function loadUser() {
  const user = await API.read('/users/me');
  document.querySelector('#user-name').innerText = user.name;
}

window.signout = Auth.signout;

if (Auth.isAuthenticated()) {
  loadAppointments();
  loadHandleCreateAppointment();
  loadHandleRemoveAppointment();
  loadUser();
}
