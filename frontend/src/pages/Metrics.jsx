// Metrics.jsx — Model metric cards + confusion matrix (all 7 models)
import { useState, useEffect } from 'react';
import { getModelMetrics } from '../api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const METRIC_DEFS = {
  accuracy:  'Of all predictions, what fraction were correct.',
  precision: 'Of customers predicted to churn, what % actually did.',
  recall:    'Of customers who actually churned, what % were caught.',
  f1:        'Harmonic mean of precision and recall — balance between both.',
};

const ALL_MODELS = [
  { value: 'LogisticRegression', label: 'Logistic Regression' },
  { value: 'RandomForest',       label: 'Random Forest' },
  { value: 'DecisionTree',       label: 'Decision Tree' },
  { value: 'KNN',                label: 'K-Nearest Neighbors' },
  { value: 'AdaBoost',           label: 'AdaBoost' },
  { value: 'GradientBoosting',   label: 'Gradient Boosting' },
  { value: 'XGBoost',            label: 'XGBoost' },
];

function pct(v) { return `${(v * 100).toFixed(1)}%`; }

export default function Metrics() {
  const [data, setData] = useState(null);
  const [selectedModel, setSelectedModel] = useState('LogisticRegression');
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    getModelMetrics(selectedModel).then(setData).catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, [selectedModel]);

  const cm = data?.confusion_matrix;
  const [[tn, fp], [fn, tp]] = cm ?? [[0,0],[0,0]];

  return (
    <main className="page">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h1>Model <span className="gradient-text">Metrics</span></h1>
        <span className="section-badge badge-teal">{data?.display_name || selectedModel}</span>
      </div>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        Evaluation metrics for each trained model, computed on a held-out
        test set (20% of the data, stratified).
      </p>

      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <Loading text="Loading metrics..." />}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Model Selector */}
          <div className="card" style={{ background: 'rgba(124,111,255,0.05)', borderColor: 'rgba(124,111,255,0.2)' }}>
             <div className="form-group" style={{ maxWidth: '400px' }}>
                <label className="form-label">Select Model to View Metrics</label>
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

          {/* Metric stat cards */}
          <div className="stat-grid">
            {['accuracy', 'precision', 'recall', 'f1'].map(key => (
              <div key={key} className="stat-card">
                <div className="stat-card__label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                <div className="stat-card__value">{pct(data[key])}</div>
                <div className="metric-def">{METRIC_DEFS[key]}</div>
                <div className="progress-bar-track" style={{ marginTop: '0.75rem' }}>
                  <div
                    className="progress-bar-fill progress-fill-safe"
                    style={{ width: pct(data[key]) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Confusion Matrix */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: '1.5rem' }}>
              <h2>Confusion Matrix</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div className="cm-grid">
                {/* Row 0 — top-left corner + column headers */}
                <div />
                <div className="cm-header-cell" style={{ color: 'var(--accent-teal)' }}>Predicted: No</div>
                <div className="cm-header-cell" style={{ color: 'var(--accent-coral)' }}>Predicted: Yes</div>

                {/* Row 1 — Actual No */}
                <div className="cm-header-cell" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--accent-teal)' }}>
                  Actual: No
                </div>
                <div className="cm-cell cm-tn">
                  <span className="cm-label">True Negative</span>
                  <span className="cm-value" style={{ color: 'var(--accent-teal)' }}>{tn.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Correctly predicted no churn</span>
                </div>
                <div className="cm-cell cm-fp">
                  <span className="cm-label">False Positive</span>
                  <span className="cm-value" style={{ color: 'var(--accent-amber)' }}>{fp.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Predicted churn, stayed</span>
                </div>

                {/* Row 2 — Actual Yes */}
                <div className="cm-header-cell" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--accent-coral)' }}>
                  Actual: Yes
                </div>
                <div className="cm-cell cm-fn">
                  <span className="cm-label">False Negative</span>
                  <span className="cm-value" style={{ color: 'var(--accent-coral)' }}>{fn.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Predicted stay, churned</span>
                </div>
                <div className="cm-cell cm-tp">
                  <span className="cm-label">True Positive</span>
                  <span className="cm-value" style={{ color: 'var(--accent-teal)' }}>{tp.toLocaleString()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Correctly predicted churn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Params */}
          {data.params && (
            <div className="card" style={{ background: 'rgba(124,111,255,0.04)', borderColor: 'rgba(124,111,255,0.15)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Model Parameters</h3>
              <div className="pill-list">
                {Object.entries(data.params).map(([k, v]) => (
                  <span key={k} className="pill">{k} = {String(v)}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes if present */}
          {data.notes && (
            <div className="card" style={{ background: 'rgba(251,191,36,0.04)', borderColor: 'rgba(251,191,36,0.15)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>📝 Notes</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.9rem' }}>{data.notes}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
