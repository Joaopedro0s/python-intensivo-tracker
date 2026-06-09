import { curriculum } from '../data/curriculum'
import { getTopicsCompleted } from '../utils/stats'

export default function Roadmap({ sessions }) {
  // Gather all covered topics
  const coveredTopics = new Set()
  sessions.forEach((s) => {
    if (s.topics) s.topics.forEach((t) => coveredTopics.add(t))
  })

  // Which weeks have sessions
  const studiedWeeks = new Set(sessions.map((s) => s.week).filter(Boolean))

  function getWeekStatus(week) {
    const allTopicsCovered = week.topics.every((t) => coveredTopics.has(t))
    if (allTopicsCovered && week.topics.length > 0) return 'completed'
    if (studiedWeeks.has(week.week)) return 'in-progress'
    return 'pending'
  }

  function getCoveredCount(week) {
    return week.topics.filter((t) => coveredTopics.has(t)).length
  }

  return (
    <div className="page-enter">
      <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
        <span className="section-title">Roadmap do currículo</span>
        <span className="section-badge">{curriculum.length} semanas</span>
      </div>

      <div className="roadmap-grid">
        {curriculum.map((week, i) => {
          const status = getWeekStatus(week)
          const covered = getCoveredCount(week)
          const pct = Math.round((covered / week.topics.length) * 100)

          return (
            <div
              key={week.week}
              className={`week-card ${status}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="week-header">
                <div>
                  <div className="week-number">Semana {week.week}</div>
                  <div className="week-title">{week.title}</div>
                </div>
                <span className={`week-status-badge ${status === 'completed' ? 'done' : status === 'in-progress' ? 'active' : 'pending'}`}>
                  {status === 'completed' ? '✓ Concluída' : status === 'in-progress' ? 'Em andamento' : 'Pendente'}
                </span>
              </div>

              <ul className="week-topics-list">
                {week.topics.map((topic) => (
                  <li
                    key={topic}
                    className={`week-topic-item${coveredTopics.has(topic) ? ' covered' : ''}`}
                  >
                    {topic}
                  </li>
                ))}
              </ul>

              {covered > 0 && (
                <div className="week-progress-wrapper">
                  <div className="week-progress-label">
                    <span>{covered}/{week.topics.length} tópicos</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
