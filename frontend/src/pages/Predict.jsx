// Predict.jsx — Full prediction form with all 19 Telco fields, all 7 models
import { useState } from 'react';
import { predict as apiPredict } from '../api';

const INITIAL = {
  gender: 'Male',
  SeniorCitizen: 0,
  Partner: 'No',
  Dependents: 'No',
  tenure: 12,
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'Fiber optic',
  OnlineSecurity: 'No',
  OnlineBackup: 'No',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'No',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: 70.35,
  TotalCharges: 844.20,
  model_name: 'LogisticRegression',
};

const ALL_MODELS = [
  { value: 'LogisticRegression', label: 'Logistic Regression (Deployed)' },
  { value: 'RandomForest',       label: 'Random Forest' },
  { value: 'DecisionTree',       label: 'Decision Tree' },
  { value: 'KNN',                label: 'K-Nearest Neighbors' },
  { value: 'AdaBoost',           label: 'AdaBoost' },
  { value: 'GradientBoosting',   label: 'Gradient Boosting' },
  { value: 'XGBoost',            label: 'XGBoost' },
];

function Field({ label, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function Select({ id, value, onChange, options }) {
  return (
    <select id={id} className="form-control" value={value} onChange={onChange}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function Predict() {
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiPredict(form);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isChurn = result?.churn_label === 'Yes';

  return (
    <main className="page">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h1>Churn <span className="gradient-text">Predictor</span></h1>
        <span className="section-badge badge-teal">Live</span>
      </div>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Fill in the customer's details to get an instant churn probability score.
        Choose any of the 7 trained models to compare predictions.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

        {/* Model Selection */}
        <div className="card" style={{ background: 'rgba(124,111,255,0.05)', borderColor: 'rgba(124,111,255,0.2)' }}>
          <div className="section-header">
            <h3>🧠 Select Model</h3>
          </div>
          <div className="form-grid">
            <Field label="Machine Learning Algorithm">
              <select
                id="model_name"
                className="form-control"
                value={form.model_name}
                onChange={set('model_name')}
              >
                {ALL_MODELS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Section 1 — Customer Info */}
        <div className="card">
          <div className="section-header">
            <h3>👤 Customer Info</h3>
          </div>
          <div className="form-grid">
            <Field label="Gender">
              <Select id="gender" value={form.gender} onChange={set('gender')} options={['Male', 'Female']} />
            </Field>
            <Field label="Senior Citizen">
              <Select id="senior" value={form.SeniorCitizen} onChange={e => setForm(p => ({ ...p, SeniorCitizen: parseInt(e.target.value) }))} options={[0, 1]} />
            </Field>
            <Field label="Partner">
              <Select id="partner" value={form.Partner} onChange={set('Partner')} options={['Yes', 'No']} />
            </Field>
            <Field label="Dependents">
              <Select id="dependents" value={form.Dependents} onChange={set('Dependents')} options={['Yes', 'No']} />
            </Field>
            <Field label="Tenure (months)">
              <input id="tenure" type="number" className="form-control" min={0} max={120} value={form.tenure} onChange={set('tenure')} />
            </Field>
          </div>
        </div>

        {/* Section 2 — Account Info */}
        <div className="card">
          <div className="section-header">
            <h3>📋 Account Info</h3>
          </div>
          <div className="form-grid">
            <Field label="Contract">
              <Select id="contract" value={form.Contract} onChange={set('Contract')}
                options={['Month-to-month', 'One year', 'Two year']} />
            </Field>
            <Field label="Paperless Billing">
              <Select id="paperless" value={form.PaperlessBilling} onChange={set('PaperlessBilling')} options={['Yes', 'No']} />
            </Field>
            <Field label="Payment Method">
              <Select id="payment" value={form.PaymentMethod} onChange={set('PaymentMethod')}
                options={['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)']} />
            </Field>
          </div>
        </div>

        {/* Section 3 — Services */}
        <div className="card">
          <div className="section-header">
            <h3>📡 Services</h3>
          </div>
          <div className="form-grid">
            <Field label="Phone Service">
              <Select id="phone" value={form.PhoneService} onChange={set('PhoneService')} options={['Yes', 'No']} />
            </Field>
            <Field label="Multiple Lines">
              <Select id="multiline" value={form.MultipleLines} onChange={set('MultipleLines')}
                options={['No', 'Yes', 'No phone service']} />
            </Field>
            <Field label="Internet Service">
              <Select id="internet" value={form.InternetService} onChange={set('InternetService')}
                options={['DSL', 'Fiber optic', 'No']} />
            </Field>
            <Field label="Online Security">
              <Select id="security" value={form.OnlineSecurity} onChange={set('OnlineSecurity')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
            <Field label="Online Backup">
              <Select id="backup" value={form.OnlineBackup} onChange={set('OnlineBackup')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
            <Field label="Device Protection">
              <Select id="device" value={form.DeviceProtection} onChange={set('DeviceProtection')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
            <Field label="Tech Support">
              <Select id="tech" value={form.TechSupport} onChange={set('TechSupport')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
            <Field label="Streaming TV">
              <Select id="tv" value={form.StreamingTV} onChange={set('StreamingTV')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
            <Field label="Streaming Movies">
              <Select id="movies" value={form.StreamingMovies} onChange={set('StreamingMovies')}
                options={['No', 'Yes', 'No internet service']} />
            </Field>
          </div>
        </div>

        {/* Section 4 — Billing */}
        <div className="card">
          <div className="section-header">
            <h3>💳 Billing</h3>
          </div>
          <div className="form-grid">
            <Field label="Monthly Charges ($)">
              <input id="monthly" type="number" className="form-control" step="0.01" min={0} value={form.MonthlyCharges} onChange={set('MonthlyCharges')} />
            </Field>
            <Field label="Total Charges ($)">
              <input id="total" type="number" className="form-control" step="0.01" min={0} value={form.TotalCharges} onChange={set('TotalCharges')} />
            </Field>
          </div>
        </div>

        {/* Submit */}
        <button
          id="predict-btn"
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ alignSelf: 'flex-start', fontSize: '1rem', padding: '0.9rem 2.5rem' }}
        >
          {loading ? '⏳ Predicting…' : '🔮 Predict Churn'}
        </button>

      </form>

      {/* Error */}
      {error && (
        <div className="card" style={{ borderColor: 'rgba(255,107,138,0.3)', background: 'rgba(255,60,96,0.06)', marginTop: '1.5rem' }}>
          <p style={{ color: 'var(--accent-coral)', fontWeight: 600 }}>⚠️ {error}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
            Make sure the FastAPI server is running on port 8000.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: '2rem' }}>
          <div className={`result-card ${isChurn ? 'churn' : 'safe'}`}>
            <div style={{ fontSize: '3.5rem' }}>{isChurn ? '⚠️' : '✅'}</div>
            <div className="stat-card__label">Prediction</div>
            <div className={`result-label ${isChurn ? 'label-churn' : 'label-safe'}`}>
              {isChurn ? 'Will Churn' : 'Will Stay'}
            </div>
            <div style={{ width: '100%', maxWidth: 360 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Churn Probability</span>
                <span style={{ fontWeight: 700, color: isChurn ? 'var(--accent-coral)' : 'var(--accent-teal)' }}>
                  {(result.churn_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className={`progress-bar-fill ${isChurn ? 'progress-fill-churn' : 'progress-fill-safe'}`}
                  style={{ width: `${(result.churn_probability * 100).toFixed(1)}%` }}
                />
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.5rem' }}>
              via {result.model_used} · threshold 0.5
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
