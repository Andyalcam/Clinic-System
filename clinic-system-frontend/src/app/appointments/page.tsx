'use client';

import AppointmentForm from './components/AppointmentForm';
import Schedule from './components/Schedule';
import DoctorSelect from './components/DoctorSelect';
import { useAppointments } from './hooks/useAppointments';

export default function Page() {
  const {
    appointments,
    patients,
    doctors,
    selectedDate,
    setSelectedDate,
    selectedDoctor,
    setSelectedDoctor,
    setDate,
    createAppointment,
    fetchPatients, 
  } = useAppointments();

  return (
    <div style={{ padding: 20 }}>
      <h1>Appointments</h1>

      {/* FORM */}
      <AppointmentForm
        patients={patients}
        doctors={doctors}
        onCreate={createAppointment}
        setDate={setDate}
        fetchPatients={fetchPatients}
      />

      <hr />

      {/* 🔥 FILTRO GLOBAL */}
      <h3>Filter by Doctor</h3>
      <DoctorSelect
        doctors={doctors}
        onChange={setSelectedDoctor}
      />
      <br /><br />

      {/* AGENDA */}
      <Schedule
        appointments={appointments}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setDate={setDate}

        selectedDoctor={selectedDoctor}
      />
    </div>
  );
}
