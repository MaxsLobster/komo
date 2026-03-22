const FALLBACK_USERS = {
  max: { initial: 'M', bg: '#5E8B62' },
  anna: { initial: 'A', bg: '#C4A24E' },
};

const SIZES = {
  sm: { size: 22, fontSize: 10 },
  md: { size: 36, fontSize: 14 },
  lg: { size: 56, fontSize: 20 },
};

// Accept either a simple key ('max'/'anna'), a UUID, or a full user object via userData prop
// Also accepts userList prop to resolve UUIDs
export default function Avatar({ user, userData, userList, size = 'sm' }) {
  const { size: px, fontSize } = SIZES[size] || SIZES.sm;

  let initial = '?';
  let bg = '#7D917E';

  if (userData) {
    initial = userData.initial || userData.name?.[0] || '?';
    bg = userData.color || '#7D917E';
  } else if (user && FALLBACK_USERS[user]) {
    initial = FALLBACK_USERS[user].initial;
    bg = FALLBACK_USERS[user].bg;
  } else if (user && userList) {
    const found = userList.find(u => u.id === user);
    if (found) {
      initial = found.initial;
      bg = found.color;
    }
  }

  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        backgroundColor: bg,
        color: 'white',
        fontSize,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {initial}
    </div>
  );
}
