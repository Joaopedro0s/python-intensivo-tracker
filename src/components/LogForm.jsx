import { useState } from 'react'
import { curriculum } from '../data/curriculum'
import { addSession } from '../db'

export default function LogForm({ onSessionAdded }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [duration, setDuration] = useState('')
  const [week, setWeek] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const weekData = curriculum.find((w) => w.week === Number(week))

  function toggleTopic(topic) {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!date || !duration) return

    setSaving(true)
    try {
      const session = {
        date,
        duration: Number(duration),
        week: week ? Number(week) : null,
        topics: selectedTopics,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      }
      await addSession(session)
      onSessionAdded(session)

      // Reset form
      setDuration('')
      setWeek('')
      setSelectedTopics([])
      setNotes('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-enter" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="log-form-card">
        <div className="log-form-title">Registrar sessão</div>
        <div className="log-form-subtitle">
          Documente o que você estudou hoje para manter o progresso visível.
        </div>

        {success && (
          <div className="toast success" style={{ position: 'relative', top: 'auto', left: 'auto', transform: 'none', marginBottom: 'var(--space-5)', textAlign: 'center', animation: 'fadeSlideUp 0.3s both' }}>
            ✓ Sessão registrada com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="date">Data</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duração (horas)</label>
              <input
                id="duration"
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                placeholder="ex: 2"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label htmlFor="week">Semana do currículo (opcional)</label>
              <select
                id="week"
                value={week}
                onChange={(e) => { setWeek(e.target.value); setSelectedTopics([]) }}
              >
                <option value="">Selecione uma semana...</option>
                {curriculum.map((w) => (
                  <option key={w.week} value={w.week}>
                    Semana {w.week} — {w.title}
                  </option>
                ))}
              </select>
            </div>

            {weekData && (
              <div className="form-group full">
                <label>Tópicos estudados</label>
                <div className="topics-grid">
                  {weekData.topics.map((topic) => (
                    <label key={topic} className={`topic-chip${selectedTopics.includes(topic) ? ' selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                      />
                      {topic}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group full">
              <label htmlFor="notes">Anotações (opcional)</label>
              <textarea
                id="notes"
                placeholder="O que você aprendeu? Quais dificuldades encontrou?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
              />
              <span className="field-help">{notes.length}/500 caracteres</span>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={saving || !date || !duration}
            >
              {saving ? 'Salvando...' : 'Salvar sessão'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
