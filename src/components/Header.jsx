export default function Header({ page, setPage, stats }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "roadmap", label: "Roadmap", icon: "🗺️" },
    { id: "form", label: "Registrar Dia", icon: "✏️" },
    { id: "history", label: "Histórico", icon: "📋" },
    { id: "badges", label: "Conquistas", icon: "🏆" },
  ];

  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-icon">🐍</span>
        <div>
          <h1 className="brand-title">Python Intensivo</h1>
          <p className="brand-sub">Tracker de Férias · IA, Dados & Automação</p>
        </div>
        {stats.streak > 0 && (
          <div className="streak-badge">
            🔥 {stats.streak} dia{stats.streak > 1 ? "s" : ""}
          </div>
        )}
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
