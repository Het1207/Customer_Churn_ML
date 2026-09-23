# ChurnScope — Telco Customer Churn Prediction

A full-stack ML web app built on the **WA Telco Customer Churn** dataset.
- **Backend**: FastAPI (Python) — serves predictions, dataset metadata, model metrics
- **Frontend**: Vite + React — 6 pages with dark-mode glassmorphism UI

---

## Project Structure

```
Project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          ← FastAPI app (6 endpoints)
│   │   ├── schemas.py       ← Pydantic request/response models
│   │   ├── preprocessing.py ← Mirrors EDA.ipynb pipeline exactly
│   │   └── model.py         ← PKL loader singleton
│   ├── artifacts/
│   │   ├── model_logreg.pkl ← Logistic Regression (production model)
│   │   ├── model_rf.pkl     ← Random Forest (comparison)
│   │   ├── model_dt.pkl     ← Decision Tree (comparison)
│   │   ├── model_knn.pkl    ← K-Nearest Neighbors (comparison)
│   │   ├── scaler.pkl       ← StandardScaler fitted on train set
│   │   ├── train_columns.pkl← Ordered feature list (30 columns)
│   │   ├── metrics.json     ← All 4 model metrics
│   │   └── dataset_info.json← Column metadata + churn stats
│   ├── retrain_models.py    ← Re-trains RF/DT/KNN, extends metrics.json
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api.js           ← Centralized fetch calls
    │   ├── App.jsx          ← React Router setup
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── Loading.jsx
    │   │   └── ErrorMessage.jsx
    │   ├── pages/
    │   │   ├── Home.jsx     ← /
    │   │   ├── Dataset.jsx  ← /dataset
    │   │   ├── Predict.jsx  ← /predict
    │   │   ├── ModelInfo.jsx← /model
    │   │   ├── Metrics.jsx  ← /metrics
    │   │   └── Compare.jsx  ← /compare
    │   └── index.css        ← Full design system
    └── package.json
```

---

## Quick Start

### 1 — Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
.venv\Scripts\activate.bat
deactivate
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 2 — Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

App available at: http://localhost:5173

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/predict` | Churn prediction for a customer |
| `GET` | `/dataset-info` | Column metadata + churn stats |
| `GET` | `/model-info` | Deployed model metadata + preprocessing info |
| `GET` | `/metrics` | All 4 model metrics |
| `GET` | `/metrics/{model_name}` | Single model metrics |
| `GET` | `/health` | Health check |

---

## Preprocessing Pipeline

Mirrors **EDA.ipynb** exactly:

1. **Label encode** (binary → 0/1): `gender`, `Partner`, `Dependents`, `PhoneService`, `PaperlessBilling`
2. **One-hot encode** (`drop_first=True`): `MultipleLines`, `InternetService`, `OnlineSecurity`, `OnlineBackup`, `DeviceProtection`, `TechSupport`, `StreamingTV`, `StreamingMovies`, `PaymentMethod`, `Contract`
3. **StandardScaler**: `tenure`, `MonthlyCharges`, `TotalCharges`
4. Resulting in **30 features** (confirmed from `train_columns.pkl`)

---

## Re-generating Artifacts After Retraining

If you retrain the primary LogisticRegression model in EDA.ipynb:

1. Copy the new `model.pkl`, `scaler.pkl`, `train_columns.pkl` to `backend/artifacts/`
   and rename `model.pkl` → `model_logreg.pkl`
2. Run the comparison script to re-train the other 3 models on the same data split:
   ```bash
   cd backend
   python retrain_models.py
   ```
   This overwrites `metrics.json` with fresh results for all 4 models.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| ML | scikit-learn, pandas, joblib |
| Backend | FastAPI, Pydantic v2, Uvicorn |
| Frontend | Vite, React 18, React Router v6 |
| Charts | Recharts |
| Styling | Vanilla CSS (dark mode, glassmorphism) |
