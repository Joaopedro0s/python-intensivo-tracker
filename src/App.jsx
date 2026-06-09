import { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import LogForm from './components/LogForm'
import History from './components/History'
import Roadmap from './components/Roadmap'
import Badges from './components/Badges'
import { getSessions } from './db'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function handleSessionAdded(session) {
    setSessions((prev) => [{ ...session, id: Date.now().toString() }, ...prev])
    setActiveTab('dashboard')
  }

  function handleSessionDeleted(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id))
  }

  function renderPage() {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Carregando sessões...</span>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            sessions={sessions}
            onNavigate={setActiveTab}
          />
        )
      case 'log':
        return (
          <LogForm onSessionAdded={handleSessionAdded} />
        )
      case 'history':
        return (
          <History
            sessions={sessions}
            onSessionDeleted={handleSessionDeleted}
          />
        )
      case 'roadmap':
        return <Roadmap sessions={sessions} />
      case 'badges':
        return <Badges sessions={sessions} />
      default:
        return null
    }
  }

  return (
    <div className="app-wrapper">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <div className="container">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}
