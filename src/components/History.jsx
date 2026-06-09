import { useState, useMemo } from "react";

export default function History({ logs, curriculum, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterTopic, setFilterTopic] = useState("");

  const topicMap = useMemo(() => Object.fromEntries(curriculum.map((t) => [t.id, t])), [curriculum]);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const topic = topicMap[Number(l.topicId)];
      const matchSearch = !search || [l.concepts, l.notes, topic?.title].some((s) => s?.toLowerCase().includes(search.toLowerCase()));
      const matchTopic = !filterTopic || String(l.topicId) === filterTopic;
      return matchSearch && matchTopic;
    });
  }, [logs, search, filterTopic, topicMap]);

  const totalHours = filtered.reduce((s, l) => s + (Number(l.hours) || 0), 0);

  return (
    <div className="history">
      <div className="history-header">
        <h2>Histórico de estudos</h2>
        <div className="history-filters">
          <input type="text" placeholder="🔍 Buscar em conceitos e notas..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
          <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
            <option value="">Todos os tópicos</option>
            {curriculum.map((t) => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
          </select>
        </div>
        <div className="history-summary">
          {filtered.length} registros · {Math.round(totalHours * 10) / 10}h no total
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search || filterTopic ? "Nenhum registro encontrado com esses filtros." : "Nenhum registro ainda. Comece estudando!"}</p>
        </div>
      ) : (
        <div className="log-list">
          {filtered.map((l) => {
            const topic = topicMap[Number(l.topicId)];
            return (
              <div key={l.id} className="log-card">
                <div className="log-card-header">
                  <div className="log-card-left">
                    <span className="log-icon">{topic?.icon || "📖"}</span>
                    <div>
                      <div className="log-topic">{topic?.title || `Tópico ${l.topicId}`}</div>
                      <div className="log-meta">
                        <span>📅 {l.date}</span>
                        <span>⏱ {l.hours}h</span>
                        <span>{'★'.repeat(l.difficulty || 3)}{'☆'.repeat(5 - (l.difficulty || 3))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="log-actions">
                    <button className="icon-btn" onClick={() => onEdit(l)} title="Editar">✏️</button>
                    <button className="icon-btn danger" onClick={() => onDelete(l.id)} title="Excluir">🗑️</button>
                  </div>
                </div>
                {l.concepts && (
                  <div className="log-concepts">
                    <strong>Conceitos:</strong> {l.concepts}
                  </div>
                )}
                {l.resources && (
                  <div className="log-resources">
                    <strong>Recursos:</strong> {l.resources}
                  </div>
                )}
                {l.notes && (
                  <div className="log-notes">
                    <strong>Notas:</strong> {l.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
