// Home.jsx — Hero + dataset summary stats
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatasetInfo } from '../api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

// Mini donut chart using SVG
function DonutChart({ yes, no }) {
  const total = yes + no;
  const pct = yes / total;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg viewBox="0 0 120 120" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="16" />
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke="url(#donutGrad)"
        strokeWidth="16"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <defs>
        <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff6b8a" />
          <stop offset="100%" stopColor="#ff3060" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setError(null);
    getDatasetInfo()
      .then(setData)
      .catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span className="section-badge badge-teal">ML Project</span>
          <span className="section-badge badge-violet">Telco Dataset</span>
        </div>
        <h1>
          Telco Customer{' '}
          <span className="gradient-text">Churn Prediction</span>
        </h1>
        <p className="subtitle" style={{ marginTop: '1rem' }}>
          Telecom companies lose thousands of customers every month to churn — the act
          of cancelling service. This machine-learning system analyzes 19 customer
          attributes (demographics, contract type, services, billing) to predict which
          customers are at risk of leaving, giving retention teams an early warning to
          act before it's too late.
        </p>
        <div className="hero-actions">
          <Link to="/predict" className="btn btn-primary">
            🔮 Try the Predictor
          </Link>
          <Link to="/dataset" className="btn btn-secondary">
            📊 Explore Dataset
          </Link>
        </div>
      </section>

      <div className="divider" />

      {/* Stats section */}
      <section>
        <div className="section-header">
          <h2>Dataset Overview</h2>
          <span className="section-badge badge-teal">Live</span>
        </div>

        {error && <ErrorMessage message={error} onRetry={load} />}
        {!data && !error && <Loading text="Fetching dataset summary..." />}

        {data && (
          <>
            <div className="stat-grid" style={{ marginBottom: '2rem' }}>
              <StatCard
                icon="👥"
                label="Total Customers"
                value={data.total_rows.toLocaleString()}
                sub="Unique telecom subscribers"
              />
              <StatCard
                icon="📋"
                label="Features"
                value={data.total_columns}
                sub="Customer attributes"
              />
              <StatCard
                icon="📉"
                label="Churn Rate"
                value={`${data.churn_rate_percent}%`}
                sub="Customers who left"
                accentColor="#ff6b8a"
              />
              <StatCard
                icon="✅"
                label="Retained"
                value={data.churn_no_count.toLocaleString()}
                sub={`vs ${data.churn_yes_count.toLocaleString()} churned`}
              />
            </div>

            {/* Churn breakdown visual */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
              <DonutChart yes={data.churn_yes_count} no={data.churn_no_count} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ marginBottom: '1rem' }}>Churn Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent-coral)' }}>⬤ Churned (Yes)</span>
                      <span style={{ fontWeight: 700 }}>{data.churn_yes_count.toLocaleString()} ({data.churn_rate_percent}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill progress-fill-churn" style={{ width: `${data.churn_rate_percent}%` }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent-teal)' }}>⬤ Retained (No)</span>
                      <span style={{ fontWeight: 700 }}>{data.churn_no_count.toLocaleString()} ({(100 - data.churn_rate_percent).toFixed(2)}%)</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill progress-fill-safe" style={{ width: `${100 - data.churn_rate_percent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA */}
      <div className="divider" />
      <section style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>Ready to predict churn?</h2>
        <p className="subtitle" style={{ margin: '0.75rem auto 1.5rem' }}>
          Enter a customer's details and get an instant probability score.
        </p>
        <Link to="/predict" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }}>
          🔮 Open Predictor
        </Link>
      </section>
    </main>
  );
}
