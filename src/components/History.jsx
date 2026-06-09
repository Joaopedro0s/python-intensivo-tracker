import { deleteSession } from '../db'

export default function History({ sessions, onSessionDeleted }) {
  async function handleDelete(id) {
    if (!confirm('Remover esta sessão?')) return
    await deleteSession(id)
    onSessionDeleted(id)
  }

  if (sessions.length === 0) {
    return (
      <div className="page-enter">
        <div className="empty-state">
          <span className="empty-state-icon">📭</span>
          <span className="empty-state-title">Nenhuma sessão ainda</span>
          <span className="empty-state-desc">
            Suas sessões de estudo vão aparecer aqui conforme você for registrando.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter">
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <span className="section-title">Histórico de sessões</span>
        <span className="section-badge">{sessions.length} sessões</span>
      </div>

      <div className="history-list">
        {sessions.map((session, i) => (
          <SessionItem
            key={session.id}
            session={session}
            onDelete={handleDelete}
            style={{ animationDelay: `${i * 40}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

function SessionItem({ session, onDelete, style }) {
  const date = new Date(session.date + 'T12:00:00')
  const day = date.getDate()
  const month = date.toLocaleString('pt-BR', { month: 'short' })
  const year = date.getFullYear()

  return (
    <div className="session-item" style={style}>
      <div className="session-date-block">
        <span className="session-date-day">{day}</span>
        <span className="session-date-month">{month}</span>
        <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{year}</span>
      </div>

      <div className="session-info">
        <span className="session-duration">
          {session.duration}h estudadas
          {session.week ? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> · Semana {session.week}</span> : null}
        </span>

        {session.topics?.length > 0 && (
          <div className="session-topics">
            {session.topics.map((t) => (
              <span key={t} className="topic-tag">{t}</span>
            ))}
          </div>
        )}

        {session.notes && (
          <span className="session-notes">"{session.notes}"</span>
        )}
      </div>

      <button
        className="btn btn-danger btn-sm"
        onClick={() => onDelete(session.id)}
        title="Excluir sessão"
      >
        ✕
      </button>
    </div>
  )
}
