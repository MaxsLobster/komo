import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import TagSelector from './TagSelector';
import UrgentToggle from './UrgentToggle';
import DateTimePicker from './DateTimePicker';

const INITIAL = { title: '', notes: '', tag_id: '', is_urgent: false, proposed_date: null, assigned_to: '' };

export default function CreateTopicSheet({ isOpen, onClose, onSubmit, tags, currentUser, onCreateTag, parentTopic }) {
  const [form, setForm] = useState(INITIAL);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) setForm({ ...INITIAL, tag_id: parentTopic?.tag_id || '', assigned_to: currentUser || '' });
  }, [isOpen, parentTopic, currentUser]);

  const doSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit({ ...form, parent_id: parentTopic?.id || null, created_by: currentUser });
  };

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleTouchStart = (e) => { startY.current = e.touches[0].clientY; setDragging(true); };
  const handleTouchMove = (e) => { if (!dragging) return; const d = e.touches[0].clientY - startY.current; if (d > 0) setDragY(d); };
  const handleTouchEnd = () => { setDragging(false); if (dragY > 120) onClose(); setDragY(0); };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 430, width: '100%', background: 'white',
          borderRadius: '24px 24px 0 0', padding: '24px 24px 40px 24px',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
          transform: `translateY(${dragY}px)`,
          transition: dragging ? 'none' : 'transform 0.15s ease-out',
          maxHeight: '85vh', overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Drag Handle */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ padding: '0 0 12px', cursor: 'grab', touchAction: 'none' }}
        >
          <div style={{ width: 40, height: 4, background: '#E4EBE4', borderRadius: 2, margin: '0 auto' }} />
        </div>

        {/* Header with title + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 700, color: '#2C3E2D' }}>
            {parentTopic ? 'Follow-up erstellen' : 'Neues Thema'}
          </h2>
          <button onClick={onClose} type="button" style={{
            width: 32, height: 32, borderRadius: '50%', background: '#F4F7F2', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#7D917E',
          }}>
            <X size={18} />
          </button>
        </div>

        {parentTopic && (
          <p style={{ fontSize: 13, color: '#7D917E', marginBottom: 16 }}>
            Follow-up zu: <span style={{ fontWeight: 600, color: '#2C3E2D' }}>{parentTopic.title}</span>
          </p>
        )}

        {/* Titel */}
        <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Titel</label>
        <input type="text" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Worum geht es?"
          style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E4EBE4', borderRadius: 14, fontSize: 15, color: '#2C3E2D', background: '#FAFAF8', marginBottom: 12, outline: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          onFocus={e => { e.target.style.borderColor = '#5E8B62'; e.target.style.boxShadow = '0 0 0 3px rgba(94,139,98,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#E4EBE4'; e.target.style.boxShadow = 'none'; }}
        />

        {/* Notizen */}
        <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Notizen</label>
        <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Zusätzliche Details (optional)"
          style={{ width: '100%', padding: '14px 16px', border: '1.5px solid #E4EBE4', borderRadius: 14, fontSize: 15, color: '#2C3E2D', background: '#FAFAF8', marginBottom: 12, outline: 'none', resize: 'none', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          onFocus={e => { e.target.style.borderColor = '#5E8B62'; e.target.style.boxShadow = '0 0 0 3px rgba(94,139,98,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = '#E4EBE4'; e.target.style.boxShadow = 'none'; }}
        />

        {/* Kategorie */}
        <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Kategorie</label>
        <div style={{ marginBottom: 12 }}>
          <TagSelector tags={tags} selectedTagId={form.tag_id} onSelect={id => update('tag_id', id)} onCreateNew={onCreateTag} />
        </div>

        {/* Wichtig */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E' }}>Priorität</label>
          <UrgentToggle isUrgent={form.is_urgent} onToggle={() => update('is_urgent', !form.is_urgent)} />
        </div>

        {/* Termin */}
        <div style={{ marginBottom: 12 }}>
          <DateTimePicker value={form.proposed_date} onChange={val => update('proposed_date', val)} />
        </div>

        {/* Zuweisen */}
        <label style={{ fontSize: 13, fontWeight: 600, color: '#7D917E', display: 'block', marginBottom: 6 }}>Zuweisen an</label>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
          {[
            { id: 'max', initial: 'M', color: '#5E8B62' },
            { id: 'anna', initial: 'A', color: '#C4A24E' },
          ].map(u => (
            <button key={u.id} type="button" onClick={() => update('assigned_to', u.id)}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: u.color, color: 'white', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: form.assigned_to === u.id ? 1 : 0.4,
                outline: form.assigned_to === u.id ? `2px solid ${u.color}` : 'none',
                outlineOffset: form.assigned_to === u.id ? 3 : 0,
                transition: 'all 0.2s ease',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
              {u.initial}
            </button>
          ))}
        </div>

        {/* Submit — explicit onClick, no form submit */}
        <button
          type="button"
          onClick={doSubmit}
          style={{
            width: '100%', padding: 16, background: form.title.trim() ? '#5E8B62' : '#B0B8B0', color: 'white',
            border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700,
            marginTop: 16, cursor: form.title.trim() ? 'pointer' : 'default',
            boxShadow: form.title.trim() ? '0 4px 16px rgba(94,139,98,0.3)' : 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            WebkitAppearance: 'none',
            position: 'relative', zIndex: 10,
            transition: 'background 0.2s, box-shadow 0.2s',
          }}>
          Thema erstellen
        </button>
      </div>
    </div>
  );
}
