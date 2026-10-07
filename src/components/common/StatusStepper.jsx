const STEPS = ['Applied', 'Shortlisted', 'Interview', 'Result'];

const indexFor = (status) =>
  ({ Applied: 0, Shortlisted: 1, 'Interview Scheduled': 2, Selected: 3, Rejected: 3 })[status] ?? 0;

/** Four-step progress track: Applied → Shortlisted → Interview → Result. */
export default function StatusStepper({ status }) {
  const current = indexFor(status);
  const final = status === 'Selected' ? 'Selected' : status === 'Rejected' ? 'Rejected' : 'Result';
  const labels = [...STEPS.slice(0, 3), final];
  return (
    <ol className="stepper" aria-label={`Progress: ${status}`}>
      {labels.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo';
        const tone = i === 3 && status === 'Rejected' ? ' rejected' : i === 3 && status === 'Selected' ? ' selected' : '';
        return (
          <li key={label + i} className={`step ${state}${tone}`}>
            <span className="dot" />
            <span className="step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
