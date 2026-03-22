import { Calendar } from 'lucide-react';
import Avatar from './Avatar';
import TagBadge from './TagBadge';
import UrgentToggle from './UrgentToggle';

export default function TopicCard({ topic, tags, onComplete, onFollowUp, onUpdate, onEdit, index = 0 }) {
  const tag = tags?.find((t) => t.id === topic.tag_id);
  const hasFollowUp = topic.status === 'follow_up';

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.toLocaleDateString('de-DE', { weekday: 'short' });
    const date = d.getDate();
    const month = d.toLocaleDateString('de-DE', { month: 'short' });
    const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    return `${day}, ${date}. ${month} · ${time}`;
  };

  return (
    <div
      className="card-tap animate-slide-up"
      onClick={() => onEdit?.(topic)}
      style={{
        background: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 14,
        boxShadow: '0 2px 16px rgba(44,62,45,0.06)',
        border: topic.is_urgent ? '1.5px solid #C07A5A' : '1.5px solid transparent',
        animationDelay: `${index * 50}ms`,
        opacity: 0,
        cursor: 'pointer',
      }}
    >
      {/* Row 1: Tag + Urgent */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {tag ? <TagBadge tag={tag} /> : <span />}
        <UrgentToggle
          isUrgent={topic.is_urgent}
          onToggle={(e) => { e?.stopPropagation?.(); onUpdate?.({ ...topic, is_urgent: !topic.is_urgent }); }}
        />
      </div>

      {/* Row 2: Title */}
      <h3 style={{ fontSize: 17, fontWeight: 700, color: '#2C3E2D', lineHeight: 1.3, marginTop: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {topic.title}
      </h3>

      {/* Row 3: Notes */}
      {topic.notes && (
        <p style={{ fontSize: 13, color: '#7D917E', lineHeight: 1.5, marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {topic.notes}
        </p>
      )}

      {/* Row 4: Meta */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {topic.proposed_date && (
          <span style={{ background: '#DCE9DD', color: '#5E8B62', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Calendar size={14} />
            {formatDate(topic.proposed_date)}
          </span>
        )}
        <Avatar user={topic.created_by} size="sm" />
        {topic.assigned_to && topic.assigned_to !== topic.created_by && (
          <Avatar user={topic.assigned_to} size="sm" />
        )}
      </div>

      {/* Row 5: Actions */}
      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onComplete?.(topic); }}
          style={{ background: '#DCE9DD', color: '#5E8B62', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >Erledigt</button>
        {!hasFollowUp && (
          <button
            onClick={(e) => { e.stopPropagation(); onFollowUp?.(topic); }}
            style={{ background: '#F5EED4', color: '#C4A24E', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >Nächste Schritte</button>
        )}
      </div>
    </div>
  );
}
