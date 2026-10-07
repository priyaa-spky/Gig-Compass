import { daysLeft } from './formatters';

export function checkEligibility(user, job) {
  const reasons = [];
  if (!user) return { eligible: false, reasons: ['Sign in to apply'] };
  if (!job.eligibleBranches.includes(user.branch)) {
    reasons.push(`Open to ${job.eligibleBranches.join(', ')} only`);
  }
  if (Number(user.cgpa) < job.minCgpa) {
    reasons.push(`Needs CGPA ${job.minCgpa}+ (yours is ${user.cgpa})`);
  }
  if (daysLeft(job.deadline) < 0) reasons.push('Applications are closed');
  return { eligible: reasons.length === 0, reasons };
}
