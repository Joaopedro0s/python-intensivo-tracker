import { getTotalHours, getStreak, getTopicsCompleted } from '../utils/stats'

const BADGE_DEFS = [
  {
    id: 'first_session',
    icon: '🚀',
    name: 'Decolagem',
    desc: 'Registre sua primeira sessão de estudo',
    check: ({ sessions }) => sessions.length >= 1,
  },
  {
    id: 'ten_hours',
    icon: '⏰',
    name: 'Dez Horas',
    desc: 'Acumule 10 horas de estudo',
    check: ({ totalHours }) => totalHours >= 10,
  },
  {
    id: 'fifty_hours',
    icon: '💎',
    name: 'Cinquenta Horas',
    desc: 'Acumule 50 horas de estudo',
    check: ({ totalHours }) => totalHours >= 50,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    name: 'Constante',
    desc: 'Mantenha 3 dias seguidos de estudo',
    check: ({ streak }) => streak >= 3,
  },
  {
    id: 'streak_7',
    icon: '⚡',
    name: 'Semanal',
    desc: 'Mantenha 7 dias seguidos de estudo',
    check: ({ streak }) => streak >= 7,
  },
  {
    id: 'ten_sessions',
    icon: '📚',
    name: 'Persistente',
    desc: 'Complete 10 sessões de estudo',
    check: ({ sessions }) => sessions.length >= 10,
  },
  {
    id: 'twenty_topics',
    icon: '🧠',
    name: 'Explorador',
    desc: 'Cubra 20 tópicos do currículo',
    check: ({ topicsCompleted }) => topicsCompleted >= 20,
  },
  {
    id: 'all_weeks',
    icon: '🏆',
    name: 'Intensivista',
    desc: 'Registre sessões em todas as 8 semanas',
    check: ({ sessions }) => {
      const weeks = new Set(sessions.map((s) => s.week).filter(Boolean))
      return weeks.size >= 8
    },
  },
]

export default function Badges({ sessions }) {
  const totalHours = getTotalHours(sessions)
  const streak = getStreak(sessions)
  const topicsCompleted = getTopicsCompleted(sessions)

  const ctx = { sessions, totalHours, streak, topicsCompleted }

  const earned = BADGE_DEFS.filter((b) => b.check(ctx))
  const locked = BADGE_DEFS.filter((b) => !b.check(ctx))

  return (
    <div className="page-enter">
      <div className="section-header" style={{ marginBottom: 'var(--space-2)' }}>
        <span className="section-title">Conquistas</span>
        <span className="section-badge">{earned.length}/{BADGE_DEFS.length} desbloqueadas</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginBottom: 'var(--space-8)' }}>
        Continue estudando para desbloquear todas as conquistas.
      </p>

      {earned.length > 0 && (
        <>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
            Desbloqueadas
          </div>
          <div className="badges-grid" style={{ marginBottom: 'var(--space-8)' }}>
            {earned.map((b, i) => (
              <BadgeCard key={b.id} badge={b} earned style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
            Bloqueadas
          </div>
          <div className="badges-grid">
            {locked.map((b, i) => (
              <BadgeCard key={b.id} badge={b} earned={false} style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function BadgeCard({ badge, earned, style }) {
  return (
    <div className={`badge-card ${earned ? 'earned' : 'locked'}`} style={style}>
      <span className="badge-icon">{badge.icon}</span>
      <span className="badge-name">{badge.name}</span>
      <span className="badge-desc">{badge.desc}</span>
      {!earned && <span className="badge-locked-label">🔒 bloqueado</span>}
    </div>
  )
}
