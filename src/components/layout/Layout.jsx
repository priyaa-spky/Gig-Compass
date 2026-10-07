import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { initials } from '../../utils/formatters';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/jobs', label: 'Job openings', icon: 'briefcase' },
  { to: '/applications', label: 'My applications', icon: 'file' },
  { to: '/interviews', label: 'Interviews', icon: 'calendar' },
  { to: '/notifications', label: 'Notifications', icon: 'bell', badge: true },
  { to: '/profile', label: 'Profile', icon: 'user' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <Link to="/" className="brand">
          <span className="brand-mark">PD</span>
          <span>Placement Desk</span>
        </Link>
        <nav>
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.badge && unreadCount > 0 && <span className="nav-count">{unreadCount}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="nav-link logout" onClick={handleLogout}>
          <Icon name="logout" />
          <span>Sign out</span>
        </button>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <div className="topbar-spacer" />
          <Link to="/notifications" className="icon-btn bell" aria-label={`Notifications, ${unreadCount} unread`}>
            <Icon name="bell" />
            {unreadCount > 0 && <span className="bell-count">{unreadCount}</span>}
          </Link>
          <Link to="/profile" className="user-chip">
            <span className="avatar">{initials(user.name)}</span>
            <span className="user-name">{user.name}</span>
          </Link>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
