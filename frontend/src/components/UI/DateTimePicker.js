import React, { useState } from 'react';
import Calendar from 'react-calendar';
import '../../utils/styles/Calendar.css';

export default function DateTimePicker() {
  const [value, onChange] = useState(new Date());
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 50 }}>
      {' '}
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}
