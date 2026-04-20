'use client';

import { useState } from 'react';
import PatientSelect from './PatientSelect';
import DoctorSelect from './DoctorSelect';
import { supabase } from '@/lib/supabaseClient';

interface Patient {
  id: string;
  full_name: string;
  phone?: string;
}

interface Doctor {
  id: string;
  users?: {
    full_name: string;
  };
}

interface AppointmentFormProps {
  patients: Patient[];
  doctors: Doctor[];
  onCreate: (appointment: {
    patientId: string;
    doctorId: string;
    date: string;
    appointmentType: string;
    reason: string;
  }) => void;
  setDate: (date: string) => void;
  fetchPatients: () => Promise<void>; // 👈 IMPORTANTE
}

export default function AppointmentForm({
  patients,
  doctors,
  onCreate,
  setDate,
  fetchPatients,
}: AppointmentFormProps) {
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setLocalDate] = useState('');
  const [appointmentType, setAppointmentType] = useState('first_time');
  const [reason, setReason] = useState('');

  // ✅ AHORA SÍ BIEN DEFINIDA
  const createPatientInline = async (name: string, phone: string) => {
    if (!name || !phone) {
      alert('Fill all fields');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('patients')
      .insert([
        {
          full_name: name,
          phone: phone,
          created_by: userData.user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      await fetchPatients(); // 🔥 refresca lista
      setPatientId(data.id);
      return data; // 🔥 selecciona automáticamente
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>Create Appointment</h3>

      {/* 🔍 PATIENT SEARCH */}
      <PatientSelect
        patients={patients}
        onSelect={(p) => setPatientId(p.id)}
        onCreate={createPatientInline}
      />

      <br /><br />

      {/* 👩‍⚕️ DOCTOR */}
      <DoctorSelect
        doctors={doctors}
        onChange={setDoctorId}
      />

      <br /><br />

      {/* 📌 TYPE */}
      <select
        value={appointmentType}
        onChange={(e) => setAppointmentType(e.target.value)}
      >
        <option value="first_time">First time</option>
        <option value="follow_up">Follow up</option>
      </select>

      <br /><br />

      {/* 📝 REASON */}
      <input
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <br /><br />

      {/* 📅 DATE */}
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => {
          setLocalDate(e.target.value);
          setDate(e.target.value);
        }}
      />

      <br /><br />

      {/* 🚀 SUBMIT */}
      <button
        onClick={() =>
          onCreate({
            patientId,
            doctorId,
            date,
            appointmentType,
            reason,
          })
        }
      >
        Create Appointment
      </button>
    </div>
  );
}
