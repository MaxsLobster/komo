import { AlertTriangle } from 'lucide-react';

export default function UrgentToggle({ isUrgent, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        border: isUrgent ? '1px solid #C07A5A' : '1px solid #E4EBE4',
        background: isUrgent ? '#F5E0D4' : '#F4F7F2',
        color: isUrgent ? '#C07A5A' : '#7D917E',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <AlertTriangle size={12} fill={isUrgent ? 'currentColor' : 'none'} />
      Wichtig
    </button>
  );
}
