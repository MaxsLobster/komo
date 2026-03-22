const USERS = {
  max: { initial: 'M', bg: '#5E8B62' },
  anna: { initial: 'A', bg: '#C4A24E' },
};

const SIZES = {
  sm: { size: 22, fontSize: 10 },
  md: { size: 36, fontSize: 14 },
  lg: { size: 56, fontSize: 20 },
};

export default function Avatar({ user, size = 'sm' }) {
  const { initial, bg } = USERS[user] || USERS.max;
  const { size: px, fontSize } = SIZES[size] || SIZES.sm;

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
