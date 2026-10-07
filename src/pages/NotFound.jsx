import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <div className="page narrow">
      <EmptyState title="Page not found" action={<Link className="btn" to="/">Go to dashboard</Link>}>
        The page you're looking for doesn't exist or has moved.
      </EmptyState>
    </div>
  );
}
