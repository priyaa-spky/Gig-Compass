import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/applications';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const ApplicationsContext = createContext(null);

export function ApplicationsProvider({ children }) {
  const { user } = useAuth();
  const { refresh: refreshNotifications } = useNotifications();
  const userId = user?.id;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setApplications([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setApplications(await api.listApplications(userId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const apply = useCallback(
    async (jobId, note) => {
      const app = await api.applyToJob(userId, jobId, note);
      setApplications((prev) => [app, ...prev]);
      refreshNotifications();
      return app;
    },
    [userId, refreshNotifications]
  );

  const appliedJobIds = useMemo(() => new Set(applications.map((a) => a.jobId)), [applications]);

  const value = useMemo(
    () => ({ applications, appliedJobIds, loading, error, apply, reload }),
    [applications, appliedJobIds, loading, error, apply, reload]
  );
  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error('useApplications must be used inside <ApplicationsProvider>');
  return ctx;
}
