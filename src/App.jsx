import { useState, useEffect, useCallback } from "react";
import { getLogs, addLog, updateLog, deleteLog } from "./db";
import { CURRICULUM, BADGES } from "./data/curriculum";
import { computeStats, getEarnedBadges, exportJSON } from "./utils/stats";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Roadmap from "./components/Roadmap";
import LogForm from "./components/LogForm";
import History from "./components/History";
import Badges from "./components/Badges";
import "./index.css";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLog, setEditLog] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLogs();
      setLogs(data);
    } catch (e) {
      showNotification("Erro ao carregar dados. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  function showNotification(msg, type = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }

  async function handleSaveLog(logData) {
    try {
      if (editLog) {
        await updateLog(editLog.id, logData);
        showNotification("Registro atualizado! ✅");
      } else {
        await addLog(logData);
        showNotification("Dia registrado com sucesso! 🎉");
      }
      setEditLog(null);
      setPage("history");
      await fetchLogs();
    } catch (e) {
      showNotification("Erro ao salvar. Tente novamente.", "error");
    }
  }

  async function handleDeleteLog(id) {
    if (!confirm("Remover este registro?")) return;
    try {
      await deleteLog(id);
      showNotification("Registro removido.");
      await fetchLogs();
    } catch (e) {
      showNotification("Erro ao remover.", "error");
    }
  }

  function handleEdit(log) {
    setEditLog(log);
    setPage("form");
  }

  const stats = computeStats(logs);
  const earnedBadges = getEarnedBadges(stats, BADGES);

  return (
    <div className="app">
      <Header page={page} setPage={setPage} stats={stats} />

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.msg}
        </div>
      )}

      <main className="main-content">
        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p>Carregando seu progresso...</p>
          </div>
        ) : (
          <>
            {page === "dashboard" && (
              <Dashboard stats={stats} logs={logs} curriculum={CURRICULUM} earnedBadges={earnedBadges} setPage={setPage} />
            )}
            {page === "roadmap" && (
              <Roadmap curriculum={CURRICULUM} logs={logs} />
            )}
            {page === "form" && (
              <LogForm
                curriculum={CURRICULUM}
                onSave={handleSaveLog}
                onCancel={() => { setEditLog(null); setPage("dashboard"); }}
                editLog={editLog}
              />
            )}
            {page === "history" && (
              <History logs={logs} curriculum={CURRICULUM} onEdit={handleEdit} onDelete={handleDeleteLog} />
            )}
            {page === "badges" && (
              <Badges earnedBadges={earnedBadges} allBadges={BADGES} stats={stats} />
            )}
          </>
        )}
      </main>

      <button className="fab" onClick={() => { setEditLog(null); setPage("form"); }} title="Registrar dia de estudo">
        +
      </button>

      <footer className="footer">
        <button className="export-btn" onClick={() => exportJSON(logs, CURRICULUM)}>
          ⬇ Exportar backup JSON
        </button>
        <span className="footer-note">Dados salvos no Firebase · {logs.length} registros</span>
      </footer>
    </div>
  );
}
