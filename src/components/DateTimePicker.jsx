export default function DateTimePicker({ value, onChange }) {
  const dateValue = value ? value.slice(0, 10) : '';
  const timeValue = value ? value.slice(11, 16) : '';

  const handleChange = (date, time) => {
    if (!date && !time) { onChange(null); return; }
    const d = date || new Date().toISOString().slice(0, 10);
    const t = time || '12:00';
    onChange(`${d}T${t}:00`);
  };

  const inputStyle = {
    flex: 1,
    padding: '14px 16px',
    border: '1.5px solid #E4EBE4',
    borderRadius: 14,
    fontSize: 15,
    color: '#2C3E2D',
    background: '#FAFAF8',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const handleFocus = (e) => { e.target.style.borderColor = '#5E8B62'; e.target.style.boxShadow = '0 0 0 3px rgba(94,139,98,0.1)'; };
  const handleBlur = (e) => { e.target.style.borderColor = '#E4EBE4'; e.target.style.boxShadow = 'none'; };

  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Terminvorschlag</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="date" value={dateValue} onChange={e => handleChange(e.target.value, timeValue)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        <input type="time" value={timeValue} onChange={e => handleChange(dateValue, e.target.value)} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
      </div>
    </div>
  );
}
