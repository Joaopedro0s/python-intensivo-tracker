import { useMemo } from "react";

export default function Dashboard({ stats, logs, curriculum, earnedBadges, setPage }) {
  const topicMap = useMemo(() => Object.fromEntries(curriculum.map((t) => [t.id, t])), [curriculum]);

  // last 30 days calendar
  const calendarDays = useMemo(() => {
    const days = [];
    const logMap = {};
    logs.forEach((l) => {
      if (!logMap[l.date]) logMap[l.date] = [];
      logMap[l.date].push(l);
    });
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, day: d.getDate(), month: d.toLocaleString("pt-BR", { month: "short" }), logs: logMap[key] || [] });
    }
    return days;
  }, [logs]);

  const recentLogs = logs.slice(0, 5);

  const weeklyData = useMemo(() => {
    const weeks = {};
    logs.forEach((l) => {
      const d = new Date(l.date);
      const wk = `Sem ${Math.ceil(d.getDate() / 7)}/${d.getMonth() + 1}`;
      weeks[wk] = (weeks[wk] || 0) + (Number(l.hours) || 0);
    });
    return Object.entries(weeks).slice(-6);
  }, [logs]);

  const maxWkHours = Math.max(...weeklyData.map(([, h]) => h), 1);

  return (
    <div className="dashboard">
      {/* Metric cards */}
      <div className="metrics-grid">
        <MetricCard value={`${stats.totalHours}h`} label="Horas estudadas" icon="⏱️" color="#6366F1" />
        <MetricCard value={`${stats.progress}%`} label="Progresso geral" icon="📈" color="#8B5CF6" />
        <MetricCard value={stats.totalDays} label="Dias estudados" icon="📅" color="#EC4899" />
        <MetricCard value={`${stats.topicsCovered}/15`} label="Tópicos cobertos" icon="📚" color="#3B82F6" />
        <MetricCard value={`🔥 ${stats.streak}`} label="Dias consecutivos" icon="" color="#F59E0B" />
        <MetricCard value={earnedBadges.length} label="Conquistas" icon="🏆" color="#10B981" />
      </div>

      {/* Progress bar */}
      <div className="card progress-card">
        <div className="card-header">
          <h2>Progresso no Roadmap</h2>
          <span className="progress-pct">{stats.progress}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
        </div>
        <div className="progress-topics">
          {curriculum.map((t) => {
            const done = logs.some((l) => Number(l.topicId) === t.id);
            return (
              <span key={t.id} className={`topic-dot ${done ? "done" : ""}`} title={t.title} style={{ background: done ? t.color : undefined }}>
                {t.icon}
              </span>
            );
          })}
        </div>
      </div>

      <div className="dashboard-row">
        {/* Calendar heatmap */}
        <div className="card calendar-card">
          <h2>Calendário — últimos 30 dias</h2>
          <div className="calendar-grid">
            {calendarDays.map((day) => (
              <div
                key={day.key}
                className={`cal-day ${day.logs.length > 0 ? "studied" : ""}`}
                title={day.logs.length > 0 ? `${day.key}: ${day.logs.map((l) => topicMap[l.topicId]?.title).join(", ")}` : day.key}
              >
                <span className="cal-num">{day.day}</span>
                {day.logs.length > 0 && <span className="cal-dot" />}
              </div>
            ))}
          </div>
          <div className="cal-legend">
            <span className="cal-legend-empty" /> Sem estudo
            <span className="cal-legend-full" /> Estudou
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="card chart-card">
          <h2>Horas por semana</h2>
          {weeklyData.length === 0 ? (
            <p className="empty-hint">Registre seus estudos para ver o gráfico semanal.</p>
          ) : (
            <div className="bar-chart">
              {weeklyData.map(([wk, h]) => (
                <div key={wk} className="bar-col">
                  <span className="bar-val">{Math.round(h * 10) / 10}h</span>
                  <div className="bar-wrap">
                    <div className="bar-fill" style={{ height: `${(h / maxWkHours) * 120}px` }} />
                  </div>
                  <span className="bar-label">{wk}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="card">
        <div className="card-header">
          <h2>Atividade recente</h2>
          <button className="link-btn" onClick={() => setPage("history")}>Ver tudo →</button>
        </div>
        {recentLogs.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum registro ainda. Comece registrando seu primeiro dia de estudo!</p>
            <button className="btn-primary" onClick={() => setPage("form")}>Registrar primeiro dia ✏️</button>
          </div>
        ) : (
          <div className="recent-list">
            {recentLogs.map((l) => {
              const topic = topicMap[Number(l.topicId)];
              return (
                <div key={l.id} className="recent-item">
                  <span className="recent-icon">{topic?.icon || "📖"}</span>
                  <div className="recent-info">
                    <span className="recent-topic">{topic?.title || l.topicId}</span>
                    <span className="recent-meta">{l.date} · {l.hours}h · dificuldade {l.difficulty}/5</span>
                  </div>
                  <div className="recent-concepts">
                    {l.concepts?.slice(0, 60)}{l.concepts?.length > 60 ? "…" : ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badges preview */}
      {earnedBadges.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Conquistas desbloqueadas</h2>
            <button className="link-btn" onClick={() => setPage("badges")}>Ver todas →</button>
          </div>
          <div className="badges-row">
            {earnedBadges.map((b) => (
              <div key={b.id} className="badge-mini">
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ value, label, icon, color }) {
  return (
    <div className="metric-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="metric-value">{icon} {value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
