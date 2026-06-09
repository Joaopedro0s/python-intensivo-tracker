import { useState, useEffect } from "react";

const DIFFICULTY_LABELS = ["", "Muito fácil", "Fácil", "Médio", "Difícil", "Muito difícil"];

export default function LogForm({ curriculum, onSave, onCancel, editLog }) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: today,
    topicId: "",
    hours: "",
    concepts: "",
    resources: "",
    notes: "",
    difficulty: 3,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  // pomodoro timer
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (editLog) {
      setForm({
        date: editLog.date || today,
        topicId: String(editLog.topicId || ""),
        hours: String(editLog.hours || ""),
        concepts: editLog.concepts || "",
        resources: editLog.resources || "",
        notes: editLog.notes || "",
        difficulty: editLog.difficulty || 3,
      });
    }
  }, [editLog]);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  function validate() {
    const errs = {};
    if (!form.date) errs.date = "Data obrigatória";
    if (!form.topicId) errs.topicId = "Selecione um tópico";
    if (!form.hours || isNaN(form.hours) || Number(form.hours) <= 0) errs.hours = "Horas inválidas";
    if (!form.concepts.trim()) errs.concepts = "Descreva o que aprendeu";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await onSave({ ...form, topicId: Number(form.topicId), hours: Number(form.hours) });
    setSaving(false);
  }

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  const timerHours = Math.floor(timer / 3600);
  const timerMin = Math.floor((timer % 3600) / 60);
  const timerSec = timer % 60;
  const timerStr = `${String(timerHours).padStart(2, "0")}:${String(timerMin).padStart(2, "0")}:${String(timerSec).padStart(2, "0")}`;

  const selectedTopic = curriculum.find((t) => t.id === Number(form.topicId));

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <h2>{editLog ? "Editar registro" : "Registrar dia de estudo"}</h2>
          <p>Documente o que você aprendeu hoje</p>
        </div>

        {/* Pomodoro timer */}
        <div className="timer-box">
          <div className="timer-display">{timerStr}</div>
          <div className="timer-controls">
            <button type="button" className="timer-btn" onClick={() => setTimerRunning(!timerRunning)}>
              {timerRunning ? "⏸ Pausar" : "▶ Iniciar"}
            </button>
            <button type="button" className="timer-btn" onClick={() => { setTimer(0); setTimerRunning(false); }}>
              ↺ Zerar
            </button>
            {timer > 0 && (
              <button type="button" className="timer-btn accent" onClick={() => set("hours", (Math.round((timer / 3600) * 10) / 10).toString())}>
                ✓ Usar {(Math.round((timer / 3600) * 10) / 10)}h
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="study-form">
          <div className="form-row">
            <div className={`form-group ${errors.date ? "has-error" : ""}`}>
              <label>Data *</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} max={today} />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
            <div className={`form-group ${errors.hours ? "has-error" : ""}`}>
              <label>Horas estudadas *</label>
              <input type="number" min="0.1" max="24" step="0.1" placeholder="ex: 2.5" value={form.hours} onChange={(e) => set("hours", e.target.value)} />
              {errors.hours && <span className="field-error">{errors.hours}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.topicId ? "has-error" : ""}`}>
            <label>Tópico estudado *</label>
            <select value={form.topicId} onChange={(e) => set("topicId", e.target.value)}>
              <option value="">Selecione um tópico...</option>
              {curriculum.map((t) => (
                <option key={t.id} value={t.id}>
                  Sem {t.week} · {t.icon} {t.title}
                </option>
              ))}
            </select>
            {errors.topicId && <span className="field-error">{errors.topicId}</span>}
          </div>

          {selectedTopic && (
            <div className="topic-hint">
              <strong>{selectedTopic.icon} {selectedTopic.title}</strong> — {selectedTopic.subtitle}
              <div className="hint-resources">
                {selectedTopic.resources.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.type === "youtube" ? "▶" : "🎓"} {r.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={`form-group ${errors.concepts ? "has-error" : ""}`}>
            <label>Conceitos-chave aprendidos *</label>
            <textarea rows={3} placeholder="O que você aprendeu? Ex: aprendi como usar pandas para filtrar DataFrames com loc e iloc..." value={form.concepts} onChange={(e) => set("concepts", e.target.value)} />
            {errors.concepts && <span className="field-error">{errors.concepts}</span>}
          </div>

          <div className="form-group">
            <label>Links / recursos usados</label>
            <input type="text" placeholder="URLs separadas por vírgula ou descrição dos materiais" value={form.resources} onChange={(e) => set("resources", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Notas e anotações livres</label>
            <textarea rows={3} placeholder="Dúvidas, insights, próximos passos..." value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>

          <div className="form-group">
            <label>Nível de dificuldade: <strong>{DIFFICULTY_LABELS[form.difficulty]}</strong></label>
            <div className="difficulty-stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" className={`star ${form.difficulty >= n ? "active" : ""}`} onClick={() => set("difficulty", n)}>
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Salvando..." : editLog ? "Atualizar" : "Registrar dia ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
