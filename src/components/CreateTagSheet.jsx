import { useState } from 'react';

const PRESETS = [
  { bg: '#E0EAF2', text: '#5B7B9A' },
  { bg: '#F5EED4', text: '#C4A24E' },
  { bg: '#E7DCF0', text: '#8B6BAE' },
  { bg: '#DCE9DD', text: '#5E8B62' },
  { bg: '#F5E1EA', text: '#C88EA7' },
  { bg: '#F0E6D0', text: '#A08050' },
  { bg: '#E0F0F0', text: '#5A9A9A' },
  { bg: '#F2E0E0', text: '#A06060' },
];

export default function CreateTagSheet({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [idx, setIdx] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), PRESETS[idx].bg, PRESETS[idx].text);
    setName(''); setIdx(0);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} className="animate-slide-up" style={{ maxWidth: 430, width: '100%', background: 'white', borderRadius: '24px 24px 0 0', padding: '24px 24px 40px 24px', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ width: 40, height: 4, background: '#E4EBE4', borderRadius: 2, margin: '0 auto 20px' }} />
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: '#2C3E2D', marginBottom: 20 }}>Neues Tag</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tag-Name" autoFocus
            style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E4EBE4', borderRadius: 14, fontSize: 15, color: '#2C3E2D', background: '#FAFAF8', marginBottom: 16, outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            onFocus={e => { e.target.style.borderColor = '#5E8B62'; e.target.style.boxShadow = '0 0 0 3px rgba(94,139,98,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#E4EBE4'; e.target.style.boxShadow = 'none'; }}
          />
          <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 8 }}>Farbe</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {PRESETS.map((p, i) => (
              <button key={i} type="button" onClick={() => setIdx(i)} style={{
                width: 36, height: 36, borderRadius: '50%', border: `2px solid ${p.text}`,
                background: p.bg, cursor: 'pointer',
                outline: i === idx ? `2px solid ${p.text}` : 'none', outlineOffset: i === idx ? 3 : 0,
                transition: 'outline 0.15s ease',
              }} />
            ))}
          </div>
          <button type="submit" disabled={!name.trim()} style={{
            width: '100%', padding: 16, background: !name.trim() ? '#B0B8B0' : '#5E8B62', color: 'white',
            border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: name.trim() ? 'pointer' : 'default',
            boxShadow: name.trim() ? '0 4px 16px rgba(94,139,98,0.3)' : 'none', transition: 'background 0.2s',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>Erstellen</button>
        </form>
      </div>
    </div>
  );
}
