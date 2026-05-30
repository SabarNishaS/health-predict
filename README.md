<<<<<<< HEAD
# 🫀 HealthPredict — AI-Powered Patient Health Analytics

A full-stack health prediction application that collects patient blood test data and uses **AI (Anthropic Claude)** to generate personalised health assessments.

---

## 🛠️ Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| **Backend** | Python + FastAPI | Fast, async-native, auto-generates OpenAPI docs |
| **Frontend** | React 18 | Component-based, rich ecosystem, great UX control |
| **Database** | SQLite + SQLAlchemy | Zero-setup persistent storage, easy to migrate |
| **AI/ML API** | Anthropic Claude (Haiku) | Accurate medical language understanding, fast, cost-effective |
| **Validation** | Pydantic v2 | Type-safe, automatic error messages |
| **Styling** | Custom CSS with CSS Variables | No framework bloat, full design control |

---

## ✨ Features

- ✅ **Full CRUD** — Create, Read, Update, Delete patient records
- 🤖 **AI Health Assessment** — Claude analyses blood values and generates a clinical remark
- 🔁 **Rule-based fallback** — Works without an API key using medical reference ranges
- 🛡️ **Data Validation** — Email format, future DOB prevention, numeric range checks
- 📊 **Stats Dashboard** — Live counts of Normal / Borderline / At-Risk patients
- 🔍 **Search** — Filter patients by name or email instantly
- 💾 **Persistent Storage** — SQLite database, survives restarts

---

## 📂 Project Structure

```
health-predict/
├── backend/
│   ├── main.py          # FastAPI routes
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── database.py      # DB engine & session
│   ├── ai_service.py    # Anthropic API + rule-based fallback
│   ├── requirements.txt
│   └── .env.example     # Template — copy to .env
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── patients.js    # Axios API layer
        ├── components/
        │   ├── PatientTable.js
        │   ├── PatientModal.js
        │   ├── DeleteModal.js
        │   └── StatsBar.js
        ├── App.js
        ├── App.css
        └── index.js
```

---

## 🚀 Setup & Running

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/health-predict.git
cd health-predict
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Run the server
uvicorn main:app --reload
```

Backend runs at: **http://localhost:8000**  
API docs at: **http://localhost:8000/docs**

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm start
```

Frontend runs at: **http://localhost:3000**

---

### 4. Getting an Anthropic API Key (Optional but recommended)

1. Go to [https://console.anthropic.com](https://console.anthropic.com)
2. Sign up / log in
3. Navigate to **API Keys** → Create a new key
4. Paste it into `backend/.env` as `ANTHROPIC_API_KEY=sk-ant-...`

> **Note:** If no API key is provided, the app uses a built-in rule-based health engine that still produces meaningful results based on standard medical reference ranges.

---

## 📋 Blood Test Reference Ranges

| Marker | Low | Normal | High |
|---|---|---|---|
| **Glucose** | <70 mg/dL | 70–99 mg/dL | ≥100 mg/dL |
| **Haemoglobin** | <12 g/dL | 12–17.5 g/dL | >17.5 g/dL |
| **Cholesterol** | — | <200 mg/dL | ≥200 mg/dL |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/patients` | List all patients |
| GET | `/patients/{id}` | Get one patient |
| POST | `/patients` | Create patient + AI prediction |
| PUT | `/patients/{id}` | Update patient (re-runs AI if blood values change) |
| DELETE | `/patients/{id}` | Delete patient |
| GET | `/docs` | Swagger UI |

---

## ⚠️ Security Notes

- Never commit `.env` or any file containing API keys
- The `.gitignore` excludes `.env` automatically
- All API keys are loaded via environment variables only

---

## 📝 License

MIT
=======
# health-predict
>>>>>>> 92d79835b10eeaafd288f8e23fe05b3f735ac4ac
