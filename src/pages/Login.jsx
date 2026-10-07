import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from './AuthShell';
import Field from '../components/common/Field';
import useForm from '../hooks/useForm';
import { emailRule, required } from '../utils/validators';
import { useAuth } from '../context/AuthContext';

const schema = { email: [required('Email'), emailRule], password: [required('Password')] };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { bind, errors, handleSubmit, setValues } = useForm({ email: '', password: '' }, schema);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async ({ email, password }) => {
    setBusy(true);
    setServerError('');
    try {
      await login(email, password);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (e) {
      setServerError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your college email to continue."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" type="email" autoComplete="email" error={errors.email} {...bind('email')} />
        <Field label="Password" type="password" autoComplete="current-password" error={errors.password} {...bind('password')} />
        {serverError && <p className="field-error" role="alert">{serverError}</p>}
        <button className="btn btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="callout demo">
        <span>Try the demo account: <code>demo@college.edu</code> / <code>Demo@1234</code></span>
        <button type="button" className="btn btn-ghost btn-small" onClick={() => setValues({ email: 'demo@college.edu', password: 'Demo@1234' })}>
          Fill in
        </button>
      </div>
    </AuthShell>
  );
}
