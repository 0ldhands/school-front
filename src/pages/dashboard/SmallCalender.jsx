import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the default styles

const SmallCalendar = () => {
  const [date, setDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '300px',
      margin: 'auto',
      background: 'linear-gradient(135deg, #4a90e2 0%, #50e3c2 100%)',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}>
      <Calendar
        onChange={handleDateChange}
        value={date}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default SmallCalendar;
