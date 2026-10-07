// Each rule takes (value, allValues) and returns an error message, or '' when valid.

export const required = (label) => (v) => (String(v ?? '').trim() ? '' : `${label} is required`);

export const minLen = (label, n) => (v) =>
  !v || String(v).trim().length >= n ? '' : `${label} must be at least ${n} characters`;

export const maxLen = (label, n) => (v) =>
  !v || String(v).length <= n ? '' : `${label} must be ${n} characters or fewer`;

export const emailRule = (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address';

// Accepts .edu, .edu.in and .ac.in addresses. Adjust to match your college's domain.
export const collegeEmail = (v) =>
  !v || /@[^\s@]+\.(edu|edu\.in|ac\.in)$/i.test(v)
    ? ''
    : 'Use your college email (ending in .edu, .edu.in or .ac.in)';

export const strongPassword = (v) => {
  if (!v) return '';
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (!/[a-z]/.test(v) || !/[A-Z]/.test(v)) return 'Include both upper and lower case letters';
  if (!/\d/.test(v)) return 'Include at least one number';
  if (!/[^A-Za-z0-9]/.test(v)) return 'Include at least one symbol, like @ or !';
  return '';
};

export const matches = (otherKey, message) => (v, all) => (v === all[otherKey] ? '' : message);

export const cgpaRule = (v) => {
  if (v === '' || v == null) return '';
  const n = Number(v);
  return !Number.isNaN(n) && n >= 0 && n <= 10 ? '' : 'CGPA must be between 0 and 10';
};

export const phone10 = (v) => (!v || /^\d{10}$/.test(v) ? '' : 'Enter a 10-digit phone number');

export const urlRule = (v) => {
  if (!v) return '';
  try {
    const u = new URL(v);
    return u.protocol === 'http:' || u.protocol === 'https:' ? '' : 'Link must start with http:// or https://';
  } catch {
    return 'Enter a valid link, e.g. https://drive.google.com/…';
  }
};

// schema = { fieldName: [rule, rule, ...] } → { fieldName: 'first error' }
export function validate(values, schema) {
  const errors = {};
  for (const key of Object.keys(schema)) {
    for (const rule of schema[key]) {
      const msg = rule(values[key], values);
      if (msg) {
        errors[key] = msg;
        break;
      }
    }
  }
  return errors;
}
