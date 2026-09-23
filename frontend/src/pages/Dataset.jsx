// Dataset.jsx — Searchable column table + cleaning notes
import { useState, useEffect, useMemo } from 'react';
import { getDatasetInfo } from '../api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Dataset() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const load = () => {
    setError(null);
    getDatasetInfo().then(setData).catch(e => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.columns.filter(col => {
      const matchSearch = col.name.toLowerCase().includes(search.toLowerCase()) ||
        col.description.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || col.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [data, search, typeFilter]);

  return (
    <main className="page">
      <div className="section-header" style={{ marginBottom: '0.5rem' }}>
        <h1>Dataset <span className="gradient-text">&amp; Columns</span></h1>
        <span className="section-badge badge-violet">WA Telco</span>
      </div>
      <p className="subtitle" style={{ marginBottom: '2rem' }}>
        The Telco Customer Churn dataset contains {data?.total_rows?.toLocaleString() ?? '...'} records
        with {data?.total_columns ?? '...'} features describing customer demographics, services, and billing.
      </p>

      {error && <ErrorMessage message={error} onRetry={load} />}
      {!data && !error && <Loading text="Loading column metadata..." />}

      {data && (
        <>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-wrapper" style={{ flex: 1, minWidth: 220 }}>
              <span className="search-icon">🔍</span>
              <input
                id="col-search"
                className="form-control search-input"
                placeholder="Search columns or descriptions…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              id="type-filter"
              className="form-control"
              style={{ width: 160 }}
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Numerical</option>
              <option>Categorical</option>
            </select>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              {filtered.length} / {data.columns.length} columns
            </span>
          </div>

          {/* Table */}
          <div className="data-table-wrapper" style={{ marginBottom: '2.5rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Column Name</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Example Values</th>
                  <th>Missing</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((col, i) => (
                  <tr key={col.name}>
                    <td style={{ color: 'var(--text-muted)', width: 36 }}>{i + 1}</td>
                    <td>
                      <code style={{ color: 'var(--accent-teal)', fontSize: '0.85rem' }}>
                        {col.name}
                      </code>
                    </td>
                    <td>
                      <span className={`tag ${col.type === 'Numerical' ? 'type-numerical' : 'type-categorical'}`}>
                        {col.type}
                      </span>
                    </td>
                    <td style={{ maxWidth: 280 }}>{col.description}</td>
                    <td style={{ maxWidth: 200 }}>
                      <div className="pill-list">
                        {col.example_values.slice(0, 3).map(v => (
                          <span key={v} className="pill">{v}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: col.missing_count > 0 ? 'var(--accent-coral)' : 'var(--text-muted)' }}>
                      {col.missing_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Data Cleaning Notes */}
          <div className="card">
            <div className="section-header">
              <h3>🧹 Data Cleaning Notes</h3>
              <span className="section-badge badge-amber">Pre-processing</span>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem' }}>
              {data.cleaning_notes.map((note, i) => (
                <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
