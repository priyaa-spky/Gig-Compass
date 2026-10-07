import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ApplicationStatusChart from '../components/charts/ApplicationStatusChart';
import PlacementTrendChart from '../components/charts/PlacementTrendChart';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import useFetch from '../hooks/useFetch';
import * as jobsApi from '../api/jobs';
import * as statsApi from '../api/stats';
import { checkEligibility } from '../utils/eligibility';
import {
  daysLeft, deadlineLabel, formatDate, formatDateTime, formatPackage, parseDate, whenLabel,
} from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuth();
  const { applications, appliedJobIds, loading: appsLoading } = useApplications();
  const jobs = useFetch(() => jobsApi.listJobs(), []);
  const trends = useFetch(() => statsApi.getPlacementTrends(), []);

  const counts = useMemo(
    () => ({
      total: applications.length,
      shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
      interviews: applications.filter((a) => a.status === 'Interview Scheduled').length,
      offers: applications.filter((a) => a.status === 'Selected').length,
    }),
    [applications]
  );

  const upcomingInterviews = useMemo(
    () =>
      applications
        .filter((a) => a.interview && parseDate(a.interview.date) >= new Date())
        .sort((a, b) => a.interview.date.localeCompare(b.interview.date)),
    [applications]
  );

  const deadlines = useMemo(
    () =>
      (jobs.data || [])
        .filter((j) => daysLeft(j.deadline) >= 0 && !appliedJobIds.has(j.id))
        .sort((a, b) => a.deadline.localeCompare(b.deadline))
        .slice(0, 5),
    [jobs.data, appliedJobIds]
  );

  const next = upcomingInterviews[0];
  const closingThisWeek = (jobs.data || []).filter(
    (j) => daysLeft(j.deadline) >= 0 && daysLeft(j.deadline) <= 7 && !appliedJobIds.has(j.id) && checkEligibility(user, j).eligible
  ).length;

  return (
    <div className="page">
      <header className="page-head">
        <h1>Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="muted">Here is where your placement season stands.</p>
      </header>

      <section className="hero" aria-label="Next up">
        {next ? (
          <>
            <div>
              <p className="hero-label">Your next interview</p>
              <h2>{next.job.company}</h2>
              <p className="hero-sub">{next.job.role}</p>
            </div>
            <div className="hero-when">
              <strong>{whenLabel(next.interview.date)}</strong>
              <span>{formatDateTime(next.interview.date)} · {next.interview.mode}</span>
              <Link className="btn btn-light" to="/interviews">See details</Link>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="hero-label">No interviews scheduled</p>
              <h2>{closingThisWeek} {closingThisWeek === 1 ? 'job you can apply to closes' : 'jobs you can apply to close'} this week</h2>
            </div>
            <div className="hero-when">
              <Link className="btn btn-light" to="/jobs">Browse openings</Link>
            </div>
          </>
        )}
      </section>

      <section className="stats" aria-label="Application statistics">
        <Stat label="Total applications" value={counts.total} tone="blue" />
        <Stat label="Shortlisted" value={counts.shortlisted} tone="amber" />
        <Stat label="Interviews lined up" value={counts.interviews} tone="violet" />
        <Stat label="Offers" value={counts.offers} tone="green" />
      </section>

      <div className="grid-2">
        <section className="panel">
          <h2>Application status</h2>
          {appsLoading ? <Loader /> : <ApplicationStatusChart applications={applications} />}
        </section>
        <section className="panel">
          <h2>Placement trends</h2>
          {trends.loading ? <Loader /> : trends.error ? <ErrorState message={trends.error} onRetry={trends.refetch} /> : <PlacementTrendChart trends={trends.data} />}
        </section>
      </div>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <h2>Upcoming deadlines</h2>
            <Link to="/jobs">All openings</Link>
          </div>
          {jobs.loading ? (
            <Loader />
          ) : jobs.error ? (
            <ErrorState message={jobs.error} onRetry={jobs.refetch} />
          ) : deadlines.length === 0 ? (
            <EmptyState title="Nothing closing soon">You've applied to every open job, or none are open right now.</EmptyState>
          ) : (
            <ul className="list">
              {deadlines.map((j) => (
                <li key={j.id}>
                  <div>
                    <Link to={`/jobs/${j.id}`}><strong>{j.role}</strong></Link>
                    <p className="muted">{j.company} · {formatPackage(j.package)}</p>
                  </div>
                  <span className={`deadline ${daysLeft(j.deadline) <= 3 ? 'urgent' : ''}`}>{deadlineLabel(j.deadline)}<small>{formatDate(j.deadline)}</small></span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Upcoming interviews</h2>
            <Link to="/interviews">Schedule</Link>
          </div>
          {upcomingInterviews.length === 0 ? (
            <EmptyState title="No interviews yet">Interview slots appear here once a company shortlists you.</EmptyState>
          ) : (
            <ul className="list">
              {upcomingInterviews.slice(0, 4).map((a) => (
                <li key={a.id}>
                  <div>
                    <strong>{a.job.company}</strong>
                    <p className="muted">{a.job.role} · {a.interview.mode}</p>
                  </div>
                  <span className="deadline">{whenLabel(a.interview.date)}<small>{formatDateTime(a.interview.date)}</small></span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
