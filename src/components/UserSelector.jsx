export default function UserSelector({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F4F7F2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: '#2C3E2D' }}>
          Willkommen bei komo
        </h1>
        <p style={{ fontSize: 15, color: '#7D917E', marginTop: 8 }}>
          Wer bist du?
        </p>
      </div>

      <div className="animate-scale-in" style={{ display: 'flex', gap: 20 }}>
        {[
          { id: 'max', name: 'Max', initial: 'M', color: '#5E8B62' },
          { id: 'anna', name: 'Anna', initial: 'A', color: '#C4A24E' },
        ].map((user) => (
          <button
            key={user.id}
            onClick={() => onSelect(user.id)}
            className="card-tap"
            style={{
              width: 100,
              height: 120,
              background: 'white',
              borderRadius: 20,
              boxShadow: '0 2px 16px rgba(44,62,45,0.08)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: user.color,
              color: 'white',
              fontSize: 20,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {user.initial}
            </div>
            <span style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#2C3E2D',
              marginTop: 10,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
