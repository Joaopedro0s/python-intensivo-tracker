export function computeStats(logs, totalCurriculumTopics = 15) {
  if (!logs.length) return { totalHours: 0, totalDays: 0, streak: 0, topicsCovered: 0, progress: 0, weeklyHours: {} };

  const totalHours = logs.reduce((s, l) => s + (Number(l.hours) || 0), 0);
  const uniqueDates = [...new Set(logs.map((l) => l.date))].sort();
  const topicsCovered = new Set(logs.map((l) => l.topicId)).size;
  const progress = Math.round((topicsCovered / totalCurriculumTopics) * 100);

  // streak
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const dateSet = new Set(uniqueDates);
  let cur = dateSet.has(today) ? today : dateSet.has(yesterday) ? yesterday : null;
  while (cur && dateSet.has(cur)) {
    streak++;
    const prev = new Date(new Date(cur).getTime() - 86400000).toISOString().slice(0, 10);
    cur = prev;
  }

  // weekly hours
  const weeklyHours = {};
  logs.forEach((l) => {
    const week = getWeekKey(l.date);
    weeklyHours[week] = (weeklyHours[week] || 0) + (Number(l.hours) || 0);
  });

  return { totalHours: Math.round(totalHours * 10) / 10, totalDays: uniqueDates.length, streak, topicsCovered, progress, weeklyHours };
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getEarnedBadges(stats, BADGES) {
  return BADGES.filter((b) => b.condition(stats));
}

export function exportJSON(logs, topics) {
  const data = { exportedAt: new Date().toISOString(), logs, topics };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `python-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
