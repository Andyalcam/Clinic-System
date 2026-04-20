'use client';

import { useState } from 'react';
import SearchSelect from './SearchSelect';

interface Patient {
  id: string;
  full_name: string;
  phone?: string;
}

interface Props {
  patients: Patient[];
  onSelect: (patient: Patient) => void;
  onCreate: (name: string, phone: string) => Promise<Patient | undefined>;
}

export default function PatientSelect({ patients, onSelect, onCreate }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  return (
    <div>
      <SearchSelect
        items={patients}
        placeholder="Search patient..."
        getItemKey={(patient) => patient.id}
        getItemLabel={(patient) => patient.full_name}
        onSelect={(patient) => onSelect(patient)}
        renderItem={(patient) => (
          <>
            {patient.full_name} {patient.phone && `(${patient.phone})`}
          </>
        )}
        searchValue={search}
        onSearchValueChange={(value) => {
          setSearch(value);
          setShowCreate(false);
        }}
        onEmptyEnter={async (currentSearch) => {
          const created = await onCreate(currentSearch, '');

          if (created) {
            onSelect(created);
            setSearch(created.full_name);
            setShowCreate(false);
          }
        }}
        onEscape={() => setShowCreate(false)}
        renderNoResults={(currentSearch) => (
          <div style={{ padding: 5 }}>
            <p>No patient found</p>
            <button
              onClick={() => {
                setShowCreate(true);
                setNewName(currentSearch);
              }}
            >
              ➕ Create new patient
            </button>
          </div>
        )}
      />

      {/* ➕ CREATE INLINE */}
      {showCreate && (
        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Full name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <br /><br />

          <input
            placeholder="Phone"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
          />

          <br /><br />

          <button
            onClick={async () => {
              const created = await onCreate(newName, newPhone);

              if (created) {
                onSelect(created); // 🔥 AUTO-SELECT
                setSearch(created.full_name);
              }

              // reset
              setShowCreate(false);
              setNewName('');
              setNewPhone('');
            }}
          >
            Save patient
          </button>

          <button
            style={{ marginLeft: 10 }}
            onClick={() => {
              setShowCreate(false);
              setNewName('');
              setNewPhone('');
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
