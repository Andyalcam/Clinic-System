'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('is_deleted', false)

    if (error) {
      console.error(error);
    } else {
      setPatients(data || []);
    }
  };

  const createPatient = async () => {
    if (!name || !phone) {
      alert('Fill all fields');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('patients')
      .insert([
        {
          full_name: name,
          phone: phone,
          created_by: userData.user.id,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {
      setName('');
      setPhone('');
      fetchPatients(); // 🔥 refresca lista
    }
  };

  const deletePatient = async (id: string) => {
    // 🔥 confirmar primero
    if (!confirm('Are you sure you want to delete this patient?')) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert('User not authenticated');
      return;
    }

    const { error } = await supabase
      .from('patients')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: userData.user.id,
      })
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      fetchPatients();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Patients</h1>

      {/* 🔥 FORMULARIO */}
      <div style={{ marginBottom: 20 }}>
        <h3>Create Patient</h3>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br /><br />

        <button onClick={createPatient}>
          Create
        </button>
      </div>

      {/* LISTA */}
      {patients.length === 0 && <p>No patients yet</p>}

      {patients.map((p) => (
        <div key={p.id} style={{ border: '1px solid gray', margin: 10, padding: 10 }}>
          <p><strong>{p.full_name}</strong></p>
          <p>{p.phone}</p>

          {/* 🔥 BOTÓN DELETE */}
          <button style={{ color: 'red' }} onClick={() => deletePatient(p.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}