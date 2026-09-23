// StatCard.jsx — Reusable stat display card
export default function StatCard({ icon, label, value, sub, accentColor }) {
  return (
    <div className="stat-card" style={accentColor ? { '--accent-teal': accentColor } : {}}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
    </div>
  );
}
