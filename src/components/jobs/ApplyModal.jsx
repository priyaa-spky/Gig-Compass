import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Field from '../common/Field';
import useForm from '../../hooks/useForm';
import { maxLen } from '../../utils/validators';
import { useApplications } from '../../context/ApplicationsContext';
import { useAuth } from '../../context/AuthContext';
import { checkEligibility } from '../../utils/eligibility';
import { formatPackage } from '../../utils/formatters';

const schema = { note: [maxLen('Note', 300)] };

export default function ApplyModal({ job, onClose }) {
  const { user } = useAuth();
  const { apply } = useApplications();
  const { bind, errors, values, handleSubmit } = useForm({ note: '' }, schema);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const { eligible, reasons } = checkEligibility(user, job);

  const onSubmit = async (v) => {
    setBusy(true);
    setError('');
    try {
      await apply(job.id, v.note);
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Modal title="Application sent" onClose={onClose}>
        <p>
          Your application for <strong>{job.role}</strong> at <strong>{job.company}</strong> is in. You'll get a
          notification when its status changes.
        </p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <Link className="btn" to="/applications">Track application</Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Apply to ${job.company}`} onClose={onClose}>
      <p className="muted">{job.role} · {job.location} · {formatPackage(job.package)}</p>
      {!eligible && (
        <div className="callout callout-warn" role="alert">
          <strong>You can't apply to this job.</strong>
          <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      )}
      {eligible && !user.resumeLink && (
        <div className="callout">
          No resume link on your profile. <Link to="/profile" onClick={onClose}>Add one</Link> so the recruiter can see it.
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field
          as="textarea"
          rows={4}
          label="Why are you a good fit? (optional)"
          hint={`${values.note.length}/300`}
          error={errors.note}
          disabled={!eligible}
          {...bind('note')}
        />
        {error && <p className="field-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={!eligible || busy}>{busy ? 'Sending…' : 'Submit application'}</button>
        </div>
      </form>
    </Modal>
  );
}
