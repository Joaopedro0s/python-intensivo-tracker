export default function Header({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'log', label: 'Registrar' },
    { id: 'history', label: 'Histórico' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'badges', label: 'Conquistas' },
  ]

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">Py</div>
            <div>
              <div className="header-title">Python Intensivo</div>
              <div className="header-subtitle">progress tracker</div>
            </div>
          </div>

          <nav className="header-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
