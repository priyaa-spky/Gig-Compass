import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import StatusStepper from '../components/common/StatusStepper';
import { useApplications } from '../context/ApplicationsContext';
import { STATUSES } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/formatters';

export default function Applications() {
  const { applications, loading, error, reload } = useApplications();
  const [tab, setTab] = useState('All');

  const counts = useMemo(() => {
    const c = { All: applications.length };
    STATUSES.forEach((s) => (c[s] = applications.filter((a) => a.status === s).length));
    return c;
  }, [applications]);

  const rows = tab === 'All' ? applications : applications.filter((a) => a.status === tab);

  return (
    <div className="page">
      <header className="page-head">
        <h1>My applications</h1>
        <p className="muted">Track every application from submission to result.</p>
      </header>

      <div className="tabs" role="tablist">
        {['All', ...STATUSES].map((s) => (
          <button key={s} role="tab" aria-selected={tab === s} className={tab === s ? 'on' : ''} onClick={() => setTab(s)}>
            {s} <span className="tab-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading applications…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={tab === 'All' ? "You haven't applied yet" : `No applications marked ${tab.toLowerCase()}`}
          action={tab === 'All' ? <Link className="btn" to="/jobs">Browse openings</Link> : null}
        >
          {tab === 'All' ? 'Find a role that fits and apply in a couple of clicks.' : 'They will show up here when their status changes.'}
        </EmptyState>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Applied on</th>
              <th>Status</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td data-label="Job">
                  <Link to={`/jobs/${a.job.id}`}><strong>{a.job.role}</strong></Link>
                  <p className="muted">{a.job.company}</p>
                </td>
                <td data-label="Applied on">{formatDate(a.appliedOn)}</td>
                <td data-label="Status">
                  <Badge status={a.status} />
                  {a.status === 'Interview Scheduled' && a.interview && (
                    <p className="muted small">{formatDateTime(a.interview.date)}</p>
                  )}
                </td>
                <td data-label="Progress"><StatusStepper status={a.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
