import { getTotalHours, getStreak, getTopicsCompleted } from '../utils/stats'
import { curriculum } from '../data/curriculum'

export default function Dashboard({ sessions, onNavigate }) {
  const totalHours = getTotalHours(sessions)
  const streak = getStreak(sessions)
  const topicsCompleted = getTopicsCompleted(sessions)
  const totalTopics = curriculum.reduce((a, w) => a + w.topics.length, 0)
  const progress = totalTopics > 0 ? Math.round((topicsCompleted / totalTopics) * 100) : 0

  const stats = [
    { icon: '⏱️', value: `${totalHours}h`, label: 'Horas estudadas' },
    { icon: '🔥', value: streak, label: 'Dias seguidos' },
    { icon: '📚', value: sessions.length, label: 'Sessões registradas' },
    { icon: '✅', value: topicsCompleted, label: 'Tópicos cobertos' },
  ]

  // Recent sessions (last 5)
  const recent = [...sessions].slice(0, 5)

  return (
    <div className="page-enter">
      {/* Progress banner */}
      <div className="progress-banner">
        <div className="progress-banner-text">
          <div className="progress-banner-heading">Seu progresso no intensivo</div>
          <div className="progress-banner-sub">
            {topicsCompleted} de {totalTopics} tópicos concluídos
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div className="progress-track" style={{ height: '8px' }}>
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        <div className="progress-banner-pct">{progress}%</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Recent sessions */}
      <div className="dashboard-section">
        <div className="section-header">
          <span className="section-title">Sessões recentes</span>
          {sessions.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('history')}>
              Ver todas →
            </button>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>📝</div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
              Nenhuma sessão registrada ainda
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 'var(--space-2) 0 var(--space-5)' }}>
              Comece a trackear seus estudos!
            </div>
            <button className="btn btn-primary" onClick={() => onNavigate('log')}>
              Registrar primeira sessão
            </button>
          </div>
        ) : (
          <div className="history-list">
            {recent.map((s) => (
              <SessionRow key={s.id} session={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SessionRow({ session }) {
  const date = new Date(session.date + 'T12:00:00')
  const day = date.getDate()
  const month = date.toLocaleString('pt-BR', { month: 'short' })

  return (
    <div className="session-item">
      <div className="session-date-block">
        <span className="session-date-day">{day}</span>
        <span className="session-date-month">{month}</span>
      </div>
      <div className="session-info">
        <span className="session-duration">
          {session.duration}h de estudo
          {session.week ? ` — Semana ${session.week}` : ''}
        </span>
        {session.topics?.length > 0 && (
          <div className="session-topics">
            {session.topics.slice(0, 4).map((t) => (
              <span key={t} className="topic-tag">{t}</span>
            ))}
            {session.topics.length > 4 && (
              <span className="topic-tag">+{session.topics.length - 4}</span>
            )}
          </div>
        )}
        {session.notes && <span className="session-notes">{session.notes}</span>}
      </div>
    </div>
  )
}
