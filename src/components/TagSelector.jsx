import { Plus } from 'lucide-react';
import TagBadge from './TagBadge';

export default function TagSelector({ tags, selectedTagId, onSelect, onCreateNew }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          tag={tag}
          selected={tag.id === selectedTagId}
          onClick={() => onSelect(tag.id === selectedTagId ? '' : tag.id)}
        />
      ))}
      <button
        type="button"
        onClick={onCreateNew}
        style={{
          width: 32, height: 32, borderRadius: '50%',
          border: '2px dashed #E4EBE4', background: 'none',
          color: '#7D917E', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s, color 0.2s',
        }}
        aria-label="Neues Tag erstellen"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
