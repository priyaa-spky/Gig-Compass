import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import Field from '../components/common/Field';
import useForm from '../hooks/useForm';
import { BRANCHES } from '../utils/constants';
import {
  cgpaRule, collegeEmail, emailRule, matches, minLen, required, strongPassword,
} from '../utils/validators';
import { useAuth } from '../context/AuthContext';

const schema = {
  name: [required('Full name'), minLen('Full name', 3)],
  rollNo: [required('Roll number')],
  email: [required('College email'), emailRule, collegeEmail],
  branch: [required('Branch')],
  cgpa: [required('CGPA'), cgpaRule],
  password: [required('Password'), strongPassword],
  confirmPassword: [required('Confirm password'), matches('password', 'Passwords do not match')],
};
const initial = { name: '', rollNo: '', email: '', branch: '', cgpa: '', password: '', confirmPassword: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { bind, errors, handleSubmit } = useForm(initial, schema);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (values) => {
    setBusy(true);
    setServerError('');
    try {
      await register(values);
      navigate('/', { replace: true });
    } catch (e) {
      setServerError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute. You can add skills and a resume later."
      footer={<>Already registered? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Full name" autoComplete="name" error={errors.name} {...bind('name')} />
        <div className="two-col">
          <Field label="Roll number" error={errors.rollNo} {...bind('rollNo')} />
          <Field as="select" label="Branch" error={errors.branch} {...bind('branch')}>
            <option value="">Select branch</option>
            {BRANCHES.map((b) => <option key={b}>{b}</option>)}
          </Field>
        </div>
        <div className="two-col">
          <Field label="College email" type="email" autoComplete="email" error={errors.email} {...bind('email')} />
          <Field label="CGPA" type="number" step="0.01" min="0" max="10" inputMode="decimal" error={errors.cgpa} {...bind('cgpa')} />
        </div>
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="8+ characters with upper and lower case, a number and a symbol."
          error={errors.password}
          {...bind('password')}
        />
        <Field label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword} {...bind('confirmPassword')} />
        {serverError && <p className="field-error" role="alert">{serverError}</p>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
}
