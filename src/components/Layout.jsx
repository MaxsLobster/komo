import { MessageCircle, CheckSquare, Plus } from 'lucide-react';

export default function Layout({ activeTab, onTabChange, greeting, userName, onFabClick, isEmpty, children }) {
  return (
    <div className="min-h-screen bg-bg">
      <div style={{ maxWidth: 430, margin: '0 auto' }} className="min-h-screen flex flex-col relative">
        {/* Header */}
        <header style={{ padding: '60px 24px 16px 24px' }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 16, fontWeight: 600, color: '#5E8B62', lineHeight: 1.4 }}>
            {greeting}{userName ? `, ${userName}` : ''}
          </h1>
          <p style={{ fontSize: 13, color: '#7D917E', marginTop: 2 }}>
            Euer Raum für das Wesentliche
          </p>
        </header>

        {/* Content */}
        <main style={{ padding: '0 24px 120px 24px' }} className="flex-1 overflow-y-auto animate-tab-fade" key={activeTab}>
          {children}
        </main>
      </div>

      {/* FAB */}
      <button
        onClick={onFabClick}
        className={`fixed z-40 ${isEmpty ? 'animate-pulse-glow' : ''}`}
        style={{
          bottom: 96,
          right: 'max(24px, calc(50% - 215px + 24px))',
          width: 56,
          height: 56,
          background: '#5E8B62',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 6px 24px rgba(94,139,98,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 28,
        }}
        aria-label="Neu erstellen"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Tab Bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: 430,
          width: '100%',
          background: 'white',
          borderTop: '1px solid #E4EBE4',
          padding: '8px 0 28px 0',
          display: 'flex',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => onTabChange('themen')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'themen' ? '#5E8B62' : '#7D917E',
            transition: 'color 0.2s ease',
          }}
        >
          <MessageCircle size={22} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Themen</span>
        </button>
        <button
          onClick={() => onTabChange('aufgaben')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'aufgaben' ? '#5E8B62' : '#7D917E',
            transition: 'color 0.2s ease',
          }}
        >
          <CheckSquare size={22} />
          <span style={{ fontSize: 11, fontWeight: 600 }}>Aufgaben</span>
        </button>
      </nav>
    </div>
  );
}
