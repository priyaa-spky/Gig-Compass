import { useState } from 'react';
import Field from '../components/common/Field';
import useForm from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { BRANCHES } from '../utils/constants';
import { initials } from '../utils/formatters';
import { resetDb } from '../api/mockDb';
import { cgpaRule, maxLen, minLen, phone10, required, urlRule } from '../utils/validators';

const schema = {
  name: [required('Full name'), minLen('Full name', 3)],
  rollNo: [required('Roll number')],
  branch: [required('Branch')],
  cgpa: [required('CGPA'), cgpaRule],
  phone: [phone10],
  resumeLink: [urlRule],
  about: [maxLen('About', 300)],
};

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { bind, errors, handleSubmit, values } = useForm(
    {
      name: user.name,
      rollNo: user.rollNo,
      branch: user.branch,
      cgpa: user.cgpa,
      phone: user.phone || '',
      skills: (user.skills || []).join(', '),
      resumeLink: user.resumeLink || '',
      about: user.about || '',
    },
    schema
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const onSubmit = async (v) => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile({
        name: v.name.trim(),
        rollNo: v.rollNo.trim().toUpperCase(),
        branch: v.branch,
        cgpa: Number(v.cgpa),
        phone: v.phone,
        skills: v.skills.split(',').map((s) => s.trim()).filter(Boolean),
        resumeLink: v.resumeLink.trim(),
        about: v.about.trim(),
      });
      setMessage({ type: 'ok', text: 'Profile saved.' });
    } catch (e) {
      setMessage({ type: 'err', text: e.message });
    } finally {
      setBusy(false);
    }
  };

  const resetDemo = () => {
    if (window.confirm('This clears all demo data stored in this browser and signs you out. Continue?')) {
      resetDb();
      logout();
      window.location.assign(window.location.pathname + '#/login');
      window.location.reload();
    }
  };

  return (
    <div className="page narrow">
      <header className="page-head profile-head">
        <span className="avatar big">{initials(user.name)}</span>
        <div>
          <h1>{user.name}</h1>
          <p className="muted">{user.email}</p>
        </div>
      </header>

      <form className="panel" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Personal and academic details</h2>
        <Field label="Full name" error={errors.name} {...bind('name')} />
        <div className="two-col">
          <Field label="Roll number" error={errors.rollNo} {...bind('rollNo')} />
          <Field as="select" label="Branch" error={errors.branch} {...bind('branch')}>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </Field>
        </div>
        <div className="two-col">
          <Field label="CGPA" type="number" step="0.01" min="0" max="10" inputMode="decimal" error={errors.cgpa} {...bind('cgpa')} />
          <Field label="Phone" type="tel" inputMode="numeric" maxLength={10} hint="10 digits, no country code" error={errors.phone} {...bind('phone')} />
        </div>
        <Field label="Skills" hint="Separate with commas, e.g. React, SQL, Python" error={errors.skills} {...bind('skills')} />
        <Field label="Resume link" type="url" hint="A shareable link to your resume (Drive, Dropbox, portfolio)" error={errors.resumeLink} {...bind('resumeLink')} />
        <Field as="textarea" rows={3} label="About you" hint={`${values.about.length}/300`} error={errors.about} {...bind('about')} />
        {message.text && (
          <p className={message.type === 'ok' ? 'success' : 'field-error'} role="status">{message.text}</p>
        )}
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
      </form>

      <section className="panel subtle">
        <h2>Demo data</h2>
        <p className="muted">Everything in this app is stored in your browser. Reset to start again with the sample data.</p>
        <button className="btn btn-ghost" onClick={resetDemo}>Reset demo data</button>
      </section>
    </div>
  );
}
