export default function TagBadge({ tag, selected, onClick }) {
  return (
    <span
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        padding: '4px 12px',
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        backgroundColor: tag.bg_color,
        color: tag.text_color,
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        outline: selected ? `2px solid ${tag.text_color}` : 'none',
        outlineOffset: selected ? 2 : 0,
        transition: 'outline 0.15s ease',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {tag.name}
    </span>
  );
}
