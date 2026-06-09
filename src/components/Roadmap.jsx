import { useMemo, useState } from "react";

export default function Roadmap({ curriculum, logs }) {
  const [expanded, setExpanded] = useState(null);

  const coveredTopics = useMemo(() => new Set(logs.map((l) => Number(l.topicId))), [logs]);

  const weeks = useMemo(() => {
    const w = {};
    curriculum.forEach((t) => {
      if (!w[t.week]) w[t.week] = [];
      w[t.week].push(t);
    });
    return w;
  }, [curriculum]);

  return (
    <div className="roadmap">
      <div className="roadmap-header">
        <h2>Roadmap — Python para IA, Dados & Automação</h2>
        <p>4 semanas · 15 tópicos · ~{curriculum.reduce((s, t) => s + t.estimatedHours, 0)}h estimadas</p>
      </div>

      {Object.entries(weeks).map(([week, topics]) => (
        <div key={week} className="roadmap-week">
          <div className="week-label">
            <span className="week-num">Semana {week}</span>
            <span className="week-est">{topics.reduce((s, t) => s + t.estimatedHours, 0)}h estimadas</span>
          </div>

          <div className="week-topics">
            {topics.map((topic, idx) => {
              const done = coveredTopics.has(topic.id);
              const isOpen = expanded === topic.id;
              return (
                <div key={topic.id} className={`roadmap-topic ${done ? "done" : ""}`}>
                  {/* connector line */}
                  {idx < topics.length - 1 && <div className="connector" style={{ background: topic.color }} />}

                  <div className="topic-node" style={{ borderColor: topic.color }}>
                    <div className="topic-node-header" onClick={() => setExpanded(isOpen ? null : topic.id)}>
                      <div className="topic-node-left">
                        <span className="topic-num" style={{ background: done ? topic.color : undefined }}>
                          {done ? "✓" : topic.id}
                        </span>
                        <span className="topic-icon">{topic.icon}</span>
                        <div>
                          <div className="topic-title">{topic.title}</div>
                          <div className="topic-subtitle">{topic.subtitle}</div>
                        </div>
                      </div>
                      <div className="topic-node-right">
                        <span className="topic-est">{topic.estimatedHours}h</span>
                        {done && <span className="done-badge">✓ Estudado</span>}
                        <span className="expand-icon">{isOpen ? "▲" : "▼"}</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="topic-detail">
                        <div className="topic-keys">
                          <strong>Tópicos-chave:</strong>
                          <ul>
                            {topic.keyTopics.map((k) => <li key={k}>{k}</li>)}
                          </ul>
                        </div>
                        <div className="topic-resources">
                          <strong>Recursos gratuitos:</strong>
                          <div className="resource-list">
                            {topic.resources.map((r) => (
                              <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className={`resource-link ${r.type}`}>
                                {r.type === "youtube" ? "▶ YouTube" : "🎓 Curso"} — {r.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
