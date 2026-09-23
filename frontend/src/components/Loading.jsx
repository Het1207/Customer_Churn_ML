// Loading.jsx — Reusable loading state
export default function Loading({ text = 'Loading data...' }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner" />
      <p className="loading-text">{text}</p>
    </div>
  );
}
