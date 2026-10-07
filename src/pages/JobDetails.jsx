import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApplyModal from '../components/jobs/ApplyModal';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import useFetch from '../hooks/useFetch';
import * as jobsApi from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import { checkEligibility } from '../utils/eligibility';
import { deadlineLabel, formatDate, formatPackage } from '../utils/formatters';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { appliedJobIds } = useApplications();
  const { data: job, loading, error, refetch } = useFetch(() => jobsApi.getJob(id), [id]);
  const [applying, setApplying] = useState(false);

  if (loading) return <Loader label="Loading job…" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const applied = appliedJobIds.has(job.id);
  const { eligible, reasons } = checkEligibility(user, job);

  return (
    <div className="page narrow">
      <Link to="/jobs" className="back">Back to openings</Link>
      <header className="detail-head">
        <span className="mono-logo big" aria-hidden="true">{job.company[0]}</span>
        <div>
          <h1>{job.role}</h1>
          <p className="muted">{job.company} · {job.location} · {job.type}</p>
        </div>
      </header>

      <dl className="facts">
        <div><dt>Package</dt><dd>{formatPackage(job.package)}</dd></div>
        <div><dt>Apply by</dt><dd>{formatDate(job.deadline)} <small>({deadlineLabel(job.deadline)})</small></dd></div>
        <div><dt>Minimum CGPA</dt><dd>{job.minCgpa}</dd></div>
        <div><dt>Open to</dt><dd>{job.eligibleBranches.join(', ')}</dd></div>
      </dl>

      <section className="panel">
        <h2>About the role</h2>
        <p>{job.description}</p>
        <h3>Skills</h3>
        <ul className="chips">{job.skills.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="apply-bar">
        {applied ? (
          <>
            <Badge status="Applied">You've applied</Badge>
            <Link className="btn btn-ghost" to="/applications">Track application</Link>
          </>
        ) : eligible ? (
          <button className="btn" onClick={() => setApplying(true)}>Apply now</button>
        ) : (
          <div className="callout callout-warn">
            <strong>You're not eligible for this job.</strong>
            <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
          </div>
        )}
      </section>

      {applying && <ApplyModal job={job} onClose={() => setApplying(false)} />}
    </div>
  );
}
