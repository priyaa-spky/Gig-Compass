import { load, save, delay, uid } from './mockDb';
import { checkEligibility } from '../utils/eligibility';
import { todayStr } from '../utils/formatters';

export async function listApplications(studentId) {
  await delay();
  const db = load();
  return db.applications
    .filter((a) => a.studentId === studentId)
    .map((a) => ({ ...a, job: db.jobs.find((j) => j.id === a.jobId) }))
    .filter((a) => a.job)
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));
}

export async function applyToJob(studentId, jobId, note = '') {
  await delay(500);
  const db = load();
  const user = db.users.find((u) => u.id === studentId);
  const job = db.jobs.find((j) => j.id === jobId);
  if (!user || !job) throw new Error('Could not find that job');
  if (db.applications.some((a) => a.studentId === studentId && a.jobId === jobId)) {
    throw new Error('You have already applied to this job');
  }
  const { eligible, reasons } = checkEligibility(user, job);
  if (!eligible) throw new Error(reasons[0]);

  const app = {
    id: uid('a'),
    jobId,
    studentId,
    status: 'Applied',
    appliedOn: todayStr(),
    note: note.trim(),
    interview: null,
  };
  db.applications.unshift(app);
  db.notifications.unshift({
    id: uid('n'),
    studentId,
    type: 'company',
    message: `Your application for ${job.role} at ${job.company} was received.`,
    date: new Date().toISOString(),
    read: false,
  });
  save(db);
  return { ...app, job };
}
