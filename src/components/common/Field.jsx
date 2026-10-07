import { useId } from 'react';

/** Labelled form control. Use `as="textarea"` or `as="select"` for those controls. */
export default function Field({ label, error, hint, as = 'input', children, ...props }) {
  const id = useId();
  const describedBy = error || hint ? `${id}-msg` : undefined;
  const common = { id, 'aria-describedby': describedBy, ...props };
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' && <textarea {...common} />}
      {as === 'select' && <select {...common}>{children}</select>}
      {as === 'input' && <input {...common} />}
      {error ? (
        <p id={`${id}-msg`} className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
