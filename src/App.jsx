import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ApplicationsProvider>
          <AppRoutes />
        </ApplicationsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
