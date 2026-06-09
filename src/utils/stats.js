export function getTotalHours(sessions) {
  return sessions.reduce((acc, s) => acc + (s.duration || 0), 0)
}

export function getStreak(sessions) {
  if (!sessions.length) return 0

  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = (prev - curr) / 86400000
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function getWeeklyHours(sessions) {
  const weeks = {}
  sessions.forEach((s) => {
    const date = new Date(s.date)
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    const key = startOfWeek.toISOString().slice(0, 10)
    weeks[key] = (weeks[key] || 0) + (s.duration || 0)
  })
  return weeks
}

export function getTopicsCompleted(sessions) {
  const topics = new Set()
  sessions.forEach((s) => {
    if (s.topics) s.topics.forEach((t) => topics.add(t))
  })
  return topics.size
}
