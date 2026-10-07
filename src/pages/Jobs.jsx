import { useMemo, useState } from 'react';
import JobCard from '../components/jobs/JobCard';
import JobFilters, { DEFAULT_FILTERS } from '../components/jobs/JobFilters';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import * as jobsApi from '../api/jobs';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationsContext';
import { checkEligibility } from '../utils/eligibility';
import { daysLeft } from '../utils/formatters';

export default function Jobs() {
  const { user } = useAuth();
  const { appliedJobIds } = useApplications();
  const { data: jobs, loading, error, refetch } = useFetch(() => jobsApi.listJobs(), []);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const q = useDebounce(filters.q, 300);

  const locations = useMemo(() => ['All', ...new Set((jobs || []).map((j) => j.location))], [jobs]);

  const results = useMemo(() => {
    if (!jobs) return [];
    const term = q.trim().toLowerCase();
    const list = jobs
      .map((job) => ({ job, eligibility: checkEligibility(user, job), applied: appliedJobIds.has(job.id) }))
      .filter(({ job, eligibility, applied }) => {
        if (term && ![job.company, job.role, ...job.skills].some((s) => s.toLowerCase().includes(term))) return false;
        if (filters.type !== 'All' && job.type !== filters.type) return false;
        if (filters.location !== 'All' && job.location !== filters.location) return false;
        if (filters.branch !== 'All' && !job.eligibleBranches.includes(filters.branch)) return false;
        if (job.package < Number(filters.minPackage)) return false;
        if (filters.deadline !== 'any') {
          const d = daysLeft(job.deadline);
          if (d < 0 || d > Number(filters.deadline)) return false;
        }
        if (filters.eligibleOnly && !eligibility.eligible && !applied) return false;
        if (filters.hideApplied && applied) return false;
        return true;
      });

    const open = (x) => (daysLeft(x.job.deadline) >= 0 ? 0 : 1); // closed jobs sink to the bottom
    const sorters = {
      deadline: (a, b) => open(a) - open(b) || a.job.deadline.localeCompare(b.job.deadline),
      package: (a, b) => b.job.package - a.job.package,
      company: (a, b) => a.job.company.localeCompare(b.job.company),
    };
    return list.sort(sorters[filters.sort]);
  }, [jobs, q, filters, user, appliedJobIds]);

  return (
    <div className="page">
      <header className="page-head">
        <h1>Job openings</h1>
        <p className="muted">{jobs ? `${results.length} of ${jobs.length} openings` : 'Finding openings…'}</p>
      </header>
      <JobFilters filters={filters} onChange={setFilters} locations={locations} onReset={() => setFilters(DEFAULT_FILTERS)} />
      {loading ? (
        <Loader label="Loading openings…" />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No openings match these filters"
          action={<button className="btn btn-ghost" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</button>}
        >
          Try a different search term or widen the deadline and package filters.
        </EmptyState>
      ) : (
        <div className="job-grid">
          {results.map(({ job, eligibility, applied }) => (
            <JobCard key={job.id} job={job} applied={applied} eligibility={eligibility} />
          ))}
        </div>
      )}
    </div>
  );
}
