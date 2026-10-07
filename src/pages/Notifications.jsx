import { useState } from 'react';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Icon from '../components/common/Icon';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/formatters';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'interview', label: 'Interview alerts' },
  { key: 'company', label: 'Company updates' },
  { key: 'announcement', label: 'Announcements' },
];
const ICONS = { interview: 'calendar', company: 'briefcase', announcement: 'bell' };

export default function Notifications() {
  const { items, loading, unreadCount, markRead, markAllRead } = useNotifications();
  const [tab, setTab] = useState('all');
  const shown = tab === 'all' ? items : items.filter((n) => n.type === tab);

  return (
    <div className="page narrow">
      <header className="page-head row">
        <div>
          <h1>Notifications</h1>
          <p className="muted">{unreadCount ? `${unreadCount} unread` : "You're all caught up"}</p>
        </div>
        <button className="btn btn-ghost" onClick={markAllRead} disabled={!unreadCount}>Mark all as read</button>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && items.length === 0 ? (
        <Loader />
      ) : shown.length === 0 ? (
        <EmptyState title="Nothing here yet">Interview alerts, company updates and placement announcements will appear in this list.</EmptyState>
      ) : (
        <ul className="notes">
          {shown.map((n) => (
            <li key={n.id} className={`note note-${n.type} ${n.read ? '' : 'unread'}`}>
              <span className="note-icon"><Icon name={ICONS[n.type]} size={18} /></span>
              <div>
                <p>{n.message}</p>
                <small className="muted">{timeAgo(n.date)}</small>
              </div>
              {!n.read && (
                <button className="btn btn-ghost btn-small" onClick={() => markRead(n.id)}>Mark read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
