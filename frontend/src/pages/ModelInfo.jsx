// ModelInfo.jsx — Algorithm info, preprocessing breakdown from API (all 7 models)
import { useState, useEffect } from 'react';
import { getModelInfo } from '../api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ALL_MODELS = [
  { value: 'LogisticRegression', label: 'Logistic Regression' },
  { value: 'RandomForest',       label: 'Random Forest' },
  { value: 'DecisionTree',       label: 'Decision Tree' },
  { value: 'KNN',                label: 'K-Nearest Neighbors' },
  { value: 'AdaBoost',           label: 'AdaBoost' },
  { value: 'GradientBoosting',   label: 'Gradient Boosting' },
  { value: 'XGBoost',            label: 'XGBoost' },
];

export default function ModelInfo() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('LogisticRegression');

  const load = () => {
    setError(null);
    getModelInfo(selectedModel).then(setData).catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, [selectedModel]);

  return (
    <main className="page">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h1>Model <span className="gradient-text">Information</span></h1>
        <span className="section-badge badge-violet">Production</span>
      </div>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Details about the algorithm deployed for predictions, its hyperparameters,
        and the full preprocessing pipeline applied before inference.
      </p>

      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <Loading text="Loading model metadata..." />}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Model Selector */}
          <div className="card" style={{ background: 'rgba(124,111,255,0.05)', borderColor: 'rgba(124,111,255,0.2)' }}>
             <div className="form-group" style={{ maxWidth: '400px' }}>
                <label className="form-label">Select Model to View</label>
                <select
                  className="form-control"
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                >
                  {ALL_MODELS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
             </div>
          </div>

          {/* Algorithm card */}
          <div className="card">
            <div className="section-header">
              <h2>🧠 {data.algorithm}</h2>
              <span className="section-badge badge-teal">
                {selectedModel === 'LogisticRegression' ? '🚀 Deployed' : 'Available'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.95rem' }}>
              {data.description}
            </p>
          </div>

          {/* Hyperparameters */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>⚙️ Hyperparameters</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {Object.entries(data.params).map(([k, v]) => (
                <div key={k} style={{
                  background: 'rgba(124,111,255,0.1)',
                  border: '1px solid rgba(124,111,255,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 1.25rem',
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {k}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-violet)' }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preprocessing pipeline */}
          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>🔄 Preprocessing Pipeline</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1rem' }}>🏷️</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Step 1 — Label Encoded</h3>
                  <span className="section-badge badge-violet" style={{ fontSize: '0.65rem' }}>Binary → 0/1</span>
                </div>
                <div className="pill-list">
                  {data.label_encoded_cols.map(c => (
                    <span key={c} className="pill">{c}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem', marginLeft: '0.5rem' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1rem' }}>🔢</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Step 2 — One-Hot Encoded</h3>
                  <span className="section-badge badge-amber" style={{ fontSize: '0.65rem' }}>drop_first=True</span>
                </div>
                <div className="pill-list">
                  {data.onehot_cols.map(c => (
                    <span key={c} className="pill pill-amber">{c}</span>
                  ))}
                </div>
              </div>

              <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1rem', marginLeft: '0.5rem' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1rem' }}>📐</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Step 3 — StandardScaler</h3>
                  <span className="section-badge badge-teal" style={{ fontSize: '0.65rem' }}>Fit on train only</span>
                </div>
                <div className="pill-list">
                  {data.scaled_cols.map(c => (
                    <span key={c} className="pill pill-teal">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature count summary */}
          <div className="card" style={{ background: 'rgba(20,240,200,0.04)', borderColor: 'rgba(20,240,200,0.15)' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div className="stat-card__label">Input Features</div>
                <div className="stat-card__value">19</div>
                <div className="stat-card__sub">Raw customer fields</div>
              </div>
              <div>
                <div className="stat-card__label">After Encoding</div>
                <div className="stat-card__value">30</div>
                <div className="stat-card__sub">Final model features</div>
              </div>
              <div>
                <div className="stat-card__label">Threshold</div>
                <div className="stat-card__value">0.5</div>
                <div className="stat-card__sub">Churn probability cutoff</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
