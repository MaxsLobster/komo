import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export default function FeedbackToast({ message, visible, onHide }) {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setShowCheck(true);
    const checkTimer = setTimeout(() => setShowCheck(false), 600);
    const hideTimer = setTimeout(onHide, 2500);
    return () => { clearTimeout(checkTimer); clearTimeout(hideTimer); };
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <>
      {/* Checkmark popup */}
      {showCheck && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 80,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div className="animate-checkmark" style={{
            width: 72, height: 72, borderRadius: '50%', background: '#5E8B62',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(94,139,98,0.4)',
          }}>
            <Check size={36} color="white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Toast message */}
      <div
        className="animate-slide-down"
        style={{
          position: 'fixed',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#2C3E2D',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 14,
          fontSize: 14,
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 70,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          whiteSpace: 'nowrap',
        }}
      >
        {message}
      </div>
    </>
  );
}
