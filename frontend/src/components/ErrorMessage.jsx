// ErrorMessage.jsx — Reusable error state
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrapper">
      <div className="error-icon">⚠️</div>
      <div className="error-title">Something went wrong</div>
      <p className="error-msg">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
