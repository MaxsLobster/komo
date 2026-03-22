import { CheckSquare } from 'lucide-react';
import TaskCard from '../components/TaskCard';

export default function Tasks({ tasks, tags, onComplete, onFollowUp, onUpdate }) {
  const openTasks = tasks.filter((t) => t.status === 'open');

  if (openTasks.length === 0) {
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
      {openTasks.map((task, index) => (
        <TaskCard key={task.id} task={task} tags={tags} onComplete={onComplete} onFollowUp={onFollowUp} onUpdate={onUpdate} index={index} />
      ))}
    </div>
  );
}
