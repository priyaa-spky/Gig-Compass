import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/notifications';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      setItems(await api.listNotifications(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  const markRead = useCallback(async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await api.markRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await api.markAllRead(userId);
  }, [userId]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);
  const value = useMemo(
    () => ({ items, loading, unreadCount, refresh, markRead, markAllRead }),
    [items, loading, unreadCount, refresh, markRead, markAllRead]
  );
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
  return ctx;
}
