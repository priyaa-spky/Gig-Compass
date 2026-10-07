import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useApplications } from '../context/ApplicationsContext';
import { formatTime, parseDate, whenLabel } from '../utils/formatters';

function InterviewCard({ app, past }) {
  const { interview: iv, job } = app;
  const d = parseDate(iv.date);
  return (
    <article className={`interview ${past ? 'past' : ''}`}>
      <div className="date-block" aria-hidden="true">
        <span>{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
        <strong>{d.getDate()}</strong>
      </div>
      <div className="interview-body">
        <h3>{job.company}</h3>
        <p className="muted">{job.role}</p>
        <p>
          {formatTime(iv.date)} · {iv.mode}
          {iv.mode === 'On-campus' && iv.venue ? ` · ${iv.venue}` : ''}
        </p>
        {!past && iv.link && (
          <a href={iv.link} target="_blank" rel="noopener noreferrer">Open meeting link</a>
        )}
      </div>
      <div className="interview-side">
        <span className="when">{whenLabel(iv.date)}</span>
        <Badge status={app.status} />
      </div>
    </article>
  );
}

export default function Interviews() {
  const { applications, loading, error, reload } = useApplications();

  const { upcoming, past } = useMemo(() => {
    const withIv = applications.filter((a) => a.interview);
    const now = new Date();
    return {
      upcoming: withIv.filter((a) => parseDate(a.interview.date) >= now).sort((a, b) => a.interview.date.localeCompare(b.interview.date)),
      past: withIv.filter((a) => parseDate(a.interview.date) < now).sort((a, b) => b.interview.date.localeCompare(a.interview.date)),
    };
  }, [applications]);

  return (
    <div className="page narrow">
      <header className="page-head">
        <h1>Interview schedule</h1>
        <p className="muted">Slots from every company that shortlisted you.</p>
      </header>
      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <>
          <h2 className="section-title">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState title="No upcoming interviews" action={<Link className="btn btn-ghost" to="/applications">Check application status</Link>}>
              When a company schedules you, the date, time and meeting link show up here.
            </EmptyState>
          ) : (
            <div className="stack">{upcoming.map((a) => <InterviewCard key={a.id} app={a} />)}</div>
          )}
          {past.length > 0 && (
            <>
              <h2 className="section-title">Completed</h2>
              <div className="stack">{past.map((a) => <InterviewCard key={a.id} app={a} past />)}</div>
            </>
          )}
        </>
      )}
    </div>
  );
}
