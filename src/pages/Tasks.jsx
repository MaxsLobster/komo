import { CheckSquare } from 'lucide-react';
import TaskCard from '../components/TaskCard';

export default function Tasks({ tasks, tags, onComplete, onFollowUp, onUpdate, onEdit }) {
  const parents = tasks.filter((t) => !t.parent_id && t.status !== 'done');
  const getFollowUp = (parentId) => tasks.find((t) => t.parent_id === parentId && t.status === 'open');

  if (parents.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 120, textAlign: 'center' }}>
        <CheckSquare size={48} color="#5E8B62" strokeWidth={1.5} />
        <p style={{ fontSize: 16, fontWeight: 600, color: '#2C3E2D', marginTop: 12 }}>Noch keine Aufgaben</p>
        <p style={{ fontSize: 13, color: '#7D917E', marginTop: 4 }}>Erstellt eure erste gemeinsame Aufgabe!</p>
      </div>
    );
  }

  return (
    <div>
      {parents.map((task, index) => {
        const followUp = getFollowUp(task.id);
        return (
          <div key={task.id}>
            <TaskCard task={task} tags={tags} onComplete={onComplete} onFollowUp={onFollowUp} onUpdate={onUpdate} onEdit={onEdit} index={index} />
            {followUp && (
              <div style={{ display: 'flex', marginBottom: 14 }}>
                <div style={{ width: 24, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 2, background: '#E4EBE4', borderRadius: 1, marginTop: -8 }} />
                </div>
                <div
                  className="card-tap"
                  onClick={() => onEdit?.(followUp)}
                  style={{
                    flex: 1,
                    background: '#FAFAF8',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 1px 8px rgba(44,62,45,0.04)',
                    border: followUp.is_urgent ? '1.5px solid #C07A5A' : '1.5px solid #E4EBE4',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#7D917E', textTransform: 'uppercase', letterSpacing: 0.5 }}>Follow-up</span>
                    {followUp.is_urgent && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#C07A5A', background: '#F5E0D4', padding: '2px 6px', borderRadius: 8 }}>Wichtig</span>
                    )}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#2C3E2D', lineHeight: 1.3 }}>{followUp.title}</p>
                  {followUp.notes && (
                    <p style={{ fontSize: 12, color: '#7D917E', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{followUp.notes}</p>
                  )}
                  <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onComplete?.(followUp); }}
                      style={{ background: '#DCE9DD', color: '#5E8B62', padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >Erledigt</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
