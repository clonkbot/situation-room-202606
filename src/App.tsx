import { useState, useEffect } from 'react';
import './styles.css';

interface Situation {
  id: string;
  title: string;
  status: 'STABLE' | 'ELEVATED' | 'CRITICAL' | 'UNKNOWN';
  value: string;
  lastUpdate: Date;
  trend: 'up' | 'down' | 'stable';
}

const initialSituations: Situation[] = [
  { id: '1', title: 'GROUP CHAT ACTIVITY', status: 'ELEVATED', value: '47 unread', lastUpdate: new Date(), trend: 'up' },
  { id: '2', title: 'WEEKEND PLANS', status: 'UNKNOWN', value: 'Pending Intel', lastUpdate: new Date(), trend: 'stable' },
  { id: '3', title: 'PIZZA FUND', status: 'CRITICAL', value: '$4.20', lastUpdate: new Date(), trend: 'down' },
  { id: '4', title: 'FANTASY LEAGUE', status: 'STABLE', value: '3rd Place', lastUpdate: new Date(), trend: 'up' },
  { id: '5', title: 'VIBES', status: 'ELEVATED', value: 'Immaculate', lastUpdate: new Date(), trend: 'up' },
  { id: '6', title: 'DRAMA LEVEL', status: 'STABLE', value: 'Minimal', lastUpdate: new Date(), trend: 'down' },
];

const statusColors = {
  STABLE: '#00ff41',
  ELEVATED: '#ffb800',
  CRITICAL: '#ff073a',
  UNKNOWN: '#00d4ff',
};

const defconLevels = [
  { level: 1, label: 'MAXIMUM CHILL', color: '#00ff41' },
  { level: 2, label: 'SLIGHT CONCERN', color: '#7fff00' },
  { level: 3, label: 'MODERATE ALERT', color: '#ffb800' },
  { level: 4, label: 'ELEVATED TENSION', color: '#ff6b00' },
  { level: 5, label: 'TOTAL CHAOS', color: '#ff073a' },
];

function RadarSweep() {
  return (
    <div className="radar-container">
      <div className="radar-grid" />
      <div className="radar-sweep" />
      <div className="radar-center" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="radar-blip"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function SituationCard({ situation }: { situation: Situation }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (situation.status === 'CRITICAL') {
        setFlash(f => !f);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [situation.status]);

  return (
    <div
      className={`situation-card ${flash ? 'flash' : ''}`}
      style={{ '--status-color': statusColors[situation.status] } as React.CSSProperties}
    >
      <div className="card-header">
        <span className="card-id">[{situation.id.padStart(3, '0')}]</span>
        <span className={`status-badge status-${situation.status.toLowerCase()}`}>
          {situation.status}
        </span>
      </div>
      <h3 className="card-title">{situation.title}</h3>
      <div className="card-value">
        <span className="value-text">{situation.value}</span>
        <span className={`trend trend-${situation.trend}`}>
          {situation.trend === 'up' ? '▲' : situation.trend === 'down' ? '▼' : '●'}
        </span>
      </div>
      <div className="card-footer">
        <div className="pulse-dot" />
        <span className="update-time">
          LAST PING: {situation.lastUpdate.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}

function DefconMeter({ level }: { level: number }) {
  return (
    <div className="defcon-meter">
      <div className="defcon-label">DEFCON STATUS</div>
      <div className="defcon-levels">
        {defconLevels.map((d) => (
          <div
            key={d.level}
            className={`defcon-level ${d.level <= level ? 'active' : ''}`}
            style={{ '--level-color': d.color } as React.CSSProperties}
          >
            <span className="level-num">{d.level}</span>
          </div>
        ))}
      </div>
      <div className="defcon-status" style={{ color: defconLevels[level - 1].color }}>
        {defconLevels[level - 1].label}
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clock">
      <div className="clock-label">ZULU TIME</div>
      <div className="clock-time">
        {time.toLocaleTimeString('en-US', { hour12: false })}
      </div>
      <div className="clock-date">
        {time.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).toUpperCase()}
      </div>
    </div>
  );
}

function App() {
  const [situations, setSituations] = useState(initialSituations);
  const [defconLevel, setDefconLevel] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newStatus, setNewStatus] = useState<Situation['status']>('UNKNOWN');

  // Simulate random updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSituations(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[idx] = { ...updated[idx], lastUpdate: new Date() };
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addSituation = () => {
    if (!newTitle.trim()) return;
    const newSituation: Situation = {
      id: String(situations.length + 1),
      title: newTitle.toUpperCase(),
      status: newStatus,
      value: newValue || 'Monitoring...',
      lastUpdate: new Date(),
      trend: 'stable',
    };
    setSituations([...situations, newSituation]);
    setNewTitle('');
    setNewValue('');
    setNewStatus('UNKNOWN');
    setShowAddModal(false);
  };

  const criticalCount = situations.filter(s => s.status === 'CRITICAL').length;

  return (
    <div className="app">
      <div className="scanlines" />
      <div className="noise" />

      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            <span className="logo-icon">◉</span>
            <span className="logo-text">THE SITUATION ROOM</span>
          </h1>
          <div className="subtitle">MONITORING COMMAND CENTER v2.0.24</div>
        </div>
        <div className="header-right">
          <Clock />
        </div>
      </header>

      <div className="top-bar">
        <DefconMeter level={defconLevel} />
        <div className="controls">
          <div className="defcon-adjuster">
            <span className="control-label">ADJUST DEFCON:</span>
            <div className="defcon-buttons">
              {[1, 2, 3, 4, 5].map(l => (
                <button
                  key={l}
                  className={`defcon-btn ${defconLevel === l ? 'active' : ''}`}
                  onClick={() => setDefconLevel(l)}
                  style={{ '--btn-color': defconLevels[l - 1].color } as React.CSSProperties}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + NEW SITUATION
          </button>
        </div>
      </div>

      <main className="main-content">
        <div className="radar-section">
          <RadarSweep />
          <div className="radar-stats">
            <div className="stat">
              <span className="stat-value">{situations.length}</span>
              <span className="stat-label">ACTIVE</span>
            </div>
            <div className="stat critical">
              <span className="stat-value">{criticalCount}</span>
              <span className="stat-label">CRITICAL</span>
            </div>
          </div>
        </div>

        <div className="situations-grid">
          {situations.map((situation, idx) => (
            <div key={situation.id} style={{ animationDelay: `${idx * 0.1}s` }} className="card-wrapper">
              <SituationCard situation={situation} />
            </div>
          ))}
        </div>
      </main>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">▶ NEW SITUATION REPORT</span>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>SITUATION TITLE</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="DESCRIBE THE SITUATION..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>CURRENT VALUE</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  placeholder="STATUS VALUE..."
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>THREAT LEVEL</label>
                <div className="status-options">
                  {(['STABLE', 'ELEVATED', 'CRITICAL', 'UNKNOWN'] as const).map(status => (
                    <button
                      key={status}
                      className={`status-option ${newStatus === status ? 'selected' : ''}`}
                      onClick={() => setNewStatus(status)}
                      style={{ '--opt-color': statusColors[status] } as React.CSSProperties}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <button className="submit-btn" onClick={addSituation}>
                CONFIRM INTEL
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <span>Requested by @ai_agi_asi_ · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
