import Avatar from './Avatar';
import TagBadge from './TagBadge';
import UrgentToggle from './UrgentToggle';

export default function TaskCard({ task, tags, onComplete, onFollowUp, onUpdate, onEdit, index = 0 }) {
  const tag = tags?.find((t) => t.id === task.tag_id);
  const hasFollowUp = task.status === 'follow_up';

  return (
    <div
      className="card-tap animate-slide-up"
      onClick={() => onEdit?.(task)}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        boxShadow: '0 2px 16px rgba(44,62,45,0.06)',
        border: task.is_urgent ? '1.5px solid #C07A5A' : '1.5px solid transparent',
        animationDelay: `${index * 50}ms`,
        opacity: 0,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {tag ? <TagBadge tag={tag} /> : <span />}
        <UrgentToggle
          isUrgent={task.is_urgent}
          onToggle={(e) => { e?.stopPropagation?.(); onUpdate?.({ ...task, is_urgent: !task.is_urgent }); }}
        />
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#2C3E2D', lineHeight: 1.3, marginTop: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {task.title}
      </h3>

      {task.notes && (
        <p style={{ fontSize: 13, color: '#7D917E', lineHeight: 1.5, marginTop: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.notes}
        </p>
      )}

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Avatar user={task.created_by} size="sm" />
          {task.assigned_to && task.assigned_to !== task.created_by && (
            <Avatar user={task.assigned_to} size="sm" />
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onComplete?.(task); }}
            style={{ background: '#DCE9DD', color: '#5E8B62', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >Erledigt</button>
          {!hasFollowUp && (
            <button
              onClick={(e) => { e.stopPropagation(); onFollowUp?.(task); }}
              style={{ background: '#F5EED4', color: '#C4A24E', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >Nächste Schritte</button>
          )}
        </div>
      </div>
    </div>
  );
}
