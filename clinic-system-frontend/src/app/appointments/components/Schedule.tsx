'use client';

type ScheduleProps = {
  appointments: any[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  setDate: (date: string) => void;
  selectedDoctor: string;
};

export default function Schedule({
  appointments,
  selectedDate,
  setSelectedDate,
  setDate,
  selectedDoctor,
}: ScheduleProps) {
  const generateHours = () => {
    const hours = new Set<number>();

    appointments.forEach((a) => {
      const h = new Date(a.scheduled_at).getHours();
      hours.add(h);
    });

    for (let i = 9; i <= 18; i++) {
      hours.add(i);
    }

    return Array.from(hours).sort((a, b) => a - b);
  };

  const hours = generateHours();

  return (
    <div>
      <h2>Daily Schedule</h2>

      {!selectedDate && <p>Select a date</p>}

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate &&
        hours.map((hour) => {
          const hourAppointments = appointments.filter((a) => {
            const d = new Date(a.scheduled_at);
            return d.getHours() === hour;
          });

          return (
            <div
              key={hour}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                marginBottom: 5,
                cursor: 'pointer',
              }}
              onClick={() => {
                if (hourAppointments.length === 0) {
                  const hourString = hour.toString().padStart(2, '0');
                  setDate(`${selectedDate}T${hourString}:00`);
                }
              }}
            >
              <strong>{hour}:00</strong>

              {hourAppointments.length > 0 ? (
                hourAppointments.map((a) => (
                  <div key={a.id}>
                    <p><strong>{a.patients?.full_name}</strong></p>
                    <p>📌 {a.status}</p>
                    <p>👨‍⚕️ Dr(a) {a.doctors?.users?.full_name}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: 'gray' }}>Available</p>
              )}
            </div>
          );
        })}
    </div>
  );
}