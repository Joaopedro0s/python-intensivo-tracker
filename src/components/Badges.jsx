export default function Badges({ earnedBadges, allBadges, stats }) {
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  return (
    <div className="badges-page">
      <div className="badges-header">
        <h2>Conquistas</h2>
        <p>{earnedBadges.length} de {allBadges.length} desbloqueadas</p>
      </div>

      <div className="badges-stats">
        <div className="badge-stat-item">
          <span>⏱️</span>
          <span>{stats.totalHours}h estudadas</span>
        </div>
        <div className="badge-stat-item">
          <span>🔥</span>
          <span>{stats.streak} dias seguidos</span>
        </div>
        <div className="badge-stat-item">
          <span>📚</span>
          <span>{stats.topicsCovered} tópicos cobertos</span>
        </div>
        <div className="badge-stat-item">
          <span>📅</span>
          <span>{stats.totalDays} dias estudados</span>
        </div>
      </div>

      <div className="badges-grid">
        {allBadges.map((badge) => {
          const earned = earnedIds.has(badge.id);
          return (
            <div key={badge.id} className={`badge-card ${earned ? "earned" : "locked"}`}>
              <div className="badge-icon">{earned ? badge.icon : "🔒"}</div>
              <div className="badge-name">{badge.label}</div>
              {!earned && <div className="badge-locked-hint">Continue estudando!</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
