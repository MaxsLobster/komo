import { MessageCircle } from 'lucide-react';
import TopicCard from '../components/TopicCard';

export default function Topics({ topics, tags, onComplete, onFollowUp, onUpdate }) {
  const openTopics = topics.filter((t) => t.status === 'open');

  if (openTopics.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 120, textAlign: 'center' }}>
        <MessageCircle size={48} color="#5E8B62" strokeWidth={1.5} />
        <p style={{ fontSize: 16, fontWeight: 600, color: '#2C3E2D', marginTop: 12 }}>Noch keine Themen</p>
        <p style={{ fontSize: 13, color: '#7D917E', marginTop: 4 }}>Erstellt euer erstes gemeinsames Thema!</p>
      </div>
    );
  }

  return (
    <div>
      {openTopics.map((topic, index) => (
        <TopicCard key={topic.id} topic={topic} tags={tags} onComplete={onComplete} onFollowUp={onFollowUp} onUpdate={onUpdate} index={index} />
      ))}
    </div>
  );
}
