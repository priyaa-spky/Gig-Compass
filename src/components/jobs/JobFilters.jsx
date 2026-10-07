import Field from '../common/Field';
import Icon from '../common/Icon';
import { BRANCHES, JOB_TYPES } from '../../utils/constants';

export const DEFAULT_FILTERS = {
  q: '',
  type: 'All',
  location: 'All',
  branch: 'All',
  minPackage: 0,
  deadline: 'any',
  eligibleOnly: false,
  hideApplied: false,
  sort: 'deadline',
};

export default function JobFilters({ filters, onChange, locations, onReset }) {
  const set = (key) => (e) => {
    const t = e.target;
    onChange({ ...filters, [key]: t.type === 'checkbox' ? t.checked : t.value });
  };

  return (
    <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter jobs">
      <div className="search">
        <Icon name="search" size={18} />
        <input
          type="search"
          placeholder="Search company, role or skill"
          value={filters.q}
          onChange={set('q')}
          aria-label="Search jobs"
        />
      </div>
      <div className="filter-grid">
        <Field as="select" label="Type" value={filters.type} onChange={set('type')}>
          <option>All</option>
          {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
        </Field>
        <Field as="select" label="Location" value={filters.location} onChange={set('location')}>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </Field>
        <Field as="select" label="Branch" value={filters.branch} onChange={set('branch')}>
          <option>All</option>
          {BRANCHES.map((b) => <option key={b}>{b}</option>)}
        </Field>
        <Field as="select" label="Minimum package" value={filters.minPackage} onChange={set('minPackage')}>
          <option value={0}>Any</option>
          {[5, 8, 10, 12].map((p) => <option key={p} value={p}>₹{p} LPA +</option>)}
        </Field>
        <Field as="select" label="Deadline" value={filters.deadline} onChange={set('deadline')}>
          <option value="any">Any time</option>
          <option value="7">Within 7 days</option>
          <option value="14">Within 14 days</option>
          <option value="30">Within 30 days</option>
        </Field>
        <Field as="select" label="Sort by" value={filters.sort} onChange={set('sort')}>
          <option value="deadline">Closing soonest</option>
          <option value="package">Highest package</option>
          <option value="company">Company A–Z</option>
        </Field>
      </div>
      <div className="filter-foot">
        <label className="check"><input type="checkbox" checked={filters.eligibleOnly} onChange={set('eligibleOnly')} /> Only jobs I'm eligible for</label>
        <label className="check"><input type="checkbox" checked={filters.hideApplied} onChange={set('hideApplied')} /> Hide jobs I've applied to</label>
        <button type="button" className="btn btn-ghost" onClick={onReset}>Clear filters</button>
      </div>
    </form>
  );
}
