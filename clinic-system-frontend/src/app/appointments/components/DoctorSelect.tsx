'use client';

import SearchSelect from './SearchSelect';

interface Doctor {
  id: string;
  users?: {
    full_name: string;
  };
}

interface Props {
  doctors: Doctor[];
  onChange: (doctorId: string) => void;
}

export default function DoctorSelect({ doctors, onChange }: Props) {
  return (
    <SearchSelect
      items={doctors}
      placeholder="Search doctor..."
      getItemKey={(doctor) => doctor.id}
      getItemLabel={(doctor) => doctor.users?.full_name || ''}
      onSelect={(doctor) => onChange(doctor.id)}
      renderItem={(doctor) => <>👩‍⚕️ {doctor.users?.full_name}</>}
    />
  );
}
