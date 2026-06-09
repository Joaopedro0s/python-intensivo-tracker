# 🐍 Python Intensivo — Tracker de Férias

Aplicativo web para rastrear seu intensivo de Python durante as férias, com roadmap curado, métricas automáticas e persistência no Firebase.

**Stack:** React + Vite + Firebase Firestore + Vercel

---

## 🚀 Setup completo (30 minutos)

### Passo 1 — Clonar e instalar

```bash
git clone https://github.com/SEU_USUARIO/python-intensivo-tracker.git
cd python-intensivo-tracker
npm install
```

---

### Passo 2 — Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"** → dê um nome (ex: `python-tracker-joao`)
3. Desative o Google Analytics (não precisa) → **Criar projeto**
4. No painel do projeto, clique em **"</> Web"** para registrar um app web
   - Dê o nome `tracker` → **Registrar app**
   - **Copie as credenciais** que aparecem (`firebaseConfig`) — você vai precisar delas
5. No menu lateral, vá em **Firestore Database** → **Criar banco de dados**
   - Escolha **"Iniciar no modo de teste"** (válido por 30 dias, suficiente para férias)
   - Selecione a região `southamerica-east1` (São Paulo) → **Ativar**

---

### Passo 3 — Configurar variáveis de ambiente

```bash
# Na pasta do projeto, crie o arquivo .env.local
cp .env.example .env.local
```

Abra `.env.local` e preencha com suas credenciais do Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=python-tracker-joao.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=python-tracker-joao
VITE_FIREBASE_STORAGE_BUCKET=python-tracker-joao.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc...
```

---

### Passo 4 — Testar localmente

```bash
npm run dev
```

Acesse `http://localhost:5173` — o app deve abrir funcionando.

---

### Passo 5 — Subir para o GitHub

```bash
git add .
git commit -m "feat: python intensivo tracker"
git push origin main
```

> ⚠️ Confirme que `.env.local` está no `.gitignore` — as credenciais **não devem** ir pro GitHub.

---

### Passo 6 — Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"New Project"** → importe o repositório `python-intensivo-tracker`
3. Na tela de configuração, expanda **"Environment Variables"** e adicione todas as variáveis do seu `.env.local`:
   - `VITE_FIREBASE_API_KEY` → valor
   - `VITE_FIREBASE_AUTH_DOMAIN` → valor
   - (repita para todas as 6 variáveis)
4. Clique em **Deploy** → aguarde ~2 minutos

Seu site estará disponível em `https://python-intensivo-tracker.vercel.app` (ou similar).

> A cada `git push`, a Vercel faz redeploy automático.

---

### Passo 7 — Ajustar regras do Firestore (após 30 dias)

Quando o período de teste expirar, vá em Firestore → **Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> Isso é seguro para uso pessoal (sem login). Para uso público, implemente autenticação.

---

## 📁 Estrutura do projeto

```
python-intensivo-tracker/
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navegação
│   │   ├── Dashboard.jsx    # Métricas, calendário, gráficos
│   │   ├── Roadmap.jsx      # Linha do tempo com recursos
│   │   ├── LogForm.jsx      # Formulário de registro diário
│   │   ├── History.jsx      # Histórico com busca/filtro
│   │   └── Badges.jsx       # Conquistas
│   ├── data/
│   │   └── curriculum.js    # 15 tópicos curados + badges
│   ├── utils/
│   │   └── stats.js         # Cálculo de métricas + export
│   ├── App.jsx              # Roteamento e estado global
│   ├── db.js                # Firestore CRUD
│   ├── firebase.js          # Inicialização Firebase
│   └── index.css            # Estilos completos + dark mode
├── .env.example             # Template de variáveis
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🗺️ Roadmap | 15 tópicos curados com YouTube + cursos gratuitos PT-BR |
| ✏️ Registro diário | Formulário com tópico, horas, conceitos, recursos, notas, dificuldade |
| ⏱️ Timer integrado | Cronômetro para medir tempo real de estudo |
| 📊 Métricas automáticas | Horas totais, progresso %, sequência, tópicos cobertos |
| 📅 Calendário heatmap | Visualização dos últimos 30 dias |
| 📈 Gráfico semanal | Horas por semana |
| 🏆 10 badges | Desbloqueio automático por conquistas |
| 🔍 Busca e filtro | Filtrar histórico por tópico ou texto livre |
| ⬇️ Backup JSON | Exportar todos os dados localmente |
| 🌙 Dark mode | Automático via `prefers-color-scheme` |
| ☁️ Cloud sync | Dados persistidos no Firebase Firestore |

---

## 📚 Currículo incluído

| Semana | Tópicos |
|---|---|
| Semana 1 | Fundamentos, Estruturas de Controle, Funções, Estruturas de Dados |
| Semana 2 | Arquivos, Pandas/NumPy, Visualização, EDA |
| Semana 3 | Automação, Web Scraping, APIs, Machine Learning Básico |
| Semana 4 | Classificação/Regressão, IA com APIs, Projeto Final |

---

## 🛠️ Desenvolvimento local

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run preview  # prévia do build
```
# python-intensivo-tracker
