import { useMemo, useState } from 'react';
import { validate } from '../utils/validators';

/**
 * Small form helper.
 *   const { bind, errors, handleSubmit } = useForm(initialValues, schema);
 *   <input {...bind('email')} />
 * Errors only show after a field is blurred or the form is submitted.
 * `schema` must be defined outside the component so its identity is stable.
 */
export default function useForm(initial, schema) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allErrors = useMemo(() => validate(values, schema), [values, schema]);
  const errors = useMemo(
    () => Object.fromEntries(Object.entries(allErrors).filter(([k]) => submitted || touched[k])),
    [allErrors, touched, submitted]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleBlur = (e) => setTouched((prev) => ({ ...prev, [e.target.name]: true }));

  const handleSubmit = (onValid) => async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(allErrors).length) return;
    await onValid(values);
  };

  const reset = (next) => {
    setValues(next ?? initial);
    setTouched({});
    setSubmitted(false);
  };

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': errors[name] ? 'true' : undefined,
  });

  return { values, errors, bind, handleSubmit, reset, setValues };
}
