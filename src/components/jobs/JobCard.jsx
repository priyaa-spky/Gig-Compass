import { Link } from 'react-router-dom';
import Icon from '../common/Icon';
import Badge from '../common/Badge';
import { daysLeft, deadlineLabel, formatPackage } from '../../utils/formatters';

export default function JobCard({ job, applied, eligibility }) {
  const left = daysLeft(job.deadline);
  const urgency = left < 0 ? 'closed' : left <= 3 ? 'urgent' : '';
  return (
    <article className="job-card">
      <div className="job-top">
        <span className="mono-logo" aria-hidden="true">{job.company[0]}</span>
        <div>
          <h3>
            <Link to={`/jobs/${job.id}`}>{job.role}</Link>
          </h3>
          <p className="muted">{job.company}</p>
        </div>
      </div>
      <ul className="chips">
        <li>{job.type}</li>
        <li><Icon name="pin" size={14} /> {job.location}</li>
        <li>{formatPackage(job.package)}</li>
      </ul>
      <div className="job-bottom">
        <span className={`deadline ${urgency}`}>
          <Icon name="clock" size={14} /> {deadlineLabel(job.deadline)}
        </span>
        {applied ? (
          <Badge status="Applied">Applied</Badge>
        ) : !eligibility.eligible ? (
          <span className="note-muted" title={eligibility.reasons.join('. ')}>Not eligible</span>
        ) : (
          <Link className="btn btn-small" to={`/jobs/${job.id}`}>View &amp; apply</Link>
        )}
      </div>
    </article>
  );
}
