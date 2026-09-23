// Navbar.jsx — Sticky top navigation with active route highlighting
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',        label: 'Home',       icon: '🏠' },
  { to: '/dataset', label: 'Dataset',    icon: '📊' },
  { to: '/predict', label: 'Predict',    icon: '🔮' },
  { to: '/model',   label: 'Model Info', icon: '🧠' },
  { to: '/metrics', label: 'Metrics',    icon: '📈' },
  { to: '/compare', label: 'Compare',    icon: '⚖️' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__brand" end>
        ⚡ ChurnScope
      </NavLink>
      <ul className="navbar__links">
        {links.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
