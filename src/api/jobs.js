import { load, delay } from './mockDb';

export async function listJobs() {
  await delay();
  return load().jobs;
}

export async function getJob(id) {
  await delay(200);
  const job = load().jobs.find((j) => j.id === id);
  if (!job) throw new Error('This job posting no longer exists');
  return job;
}
