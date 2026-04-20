'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchPatients();
    fetchDoctors();
  }, []);

  // 🔥 REFRESH AGENDA
  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, selectedDoctor]);

  // =========================
  // 📅 APPOINTMENTS
  // =========================
  const fetchAppointments = async () => {
    if (!selectedDate) return;

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patients(full_name),
        doctors(
          id,
          users(full_name)
        )
      `)
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString());

    // 🔥 filtro por doctor (si aplica)
    if (selectedDoctor) {
      query = query.eq('doctor_id', selectedDoctor);
    }

    const { data, error } = await query.order('scheduled_at');

    if (error) {
      console.error('Appointments error:', error);
    } else {
      setAppointments(data || []);
    }
  };

  // =========================
  // 🧍 PATIENTS
  // =========================
  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('is_deleted', false);

    if (error) {
      console.error('Patients error:', error);
    } else {
      setPatients(data || []);
    }
  };

  // =========================
  // 👩‍⚕️ DOCTORS
  // =========================
  const fetchDoctors = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users(full_name, is_active)
      `);

    if (error) {
      console.error('Doctors error:', error);
      return;
    }

    // 🔥 filtrar activos desde users
    const activeDoctors = (data || []).filter(
      (d) => d.users?.is_active
    );

    setDoctors(activeDoctors);
  };

  // =========================
  // ➕ CREATE APPOINTMENT
  // =========================
  const createAppointment = async ({
    patientId,
    doctorId,
    date,
    appointmentType,
    reason,
  }: {
    patientId: string;
    doctorId: string;
    date: string;
    appointmentType: string;
    reason: string;
  }) => {
    if (!patientId || !doctorId || !date) {
      alert('Fill all required fields');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          doctor_id: doctorId,
          created_by: userData.user.id,
          scheduled_at: date,
          appointment_type: appointmentType,
          reason,
          status: 'pending',
        },
      ]);

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      fetchAppointments(); // 🔥 refresh
    }
  };

  // =========================
  // EXPORTS
  // =========================
  return {
    appointments,
    patients,
    doctors,

    selectedDate,
    setSelectedDate,

    selectedDoctor,
    setSelectedDoctor,

    date,
    setDate,

    createAppointment,

    fetchPatients, // 🔥 exportar para usar en AppointmentForm
  };
};