# Placement Desk: Student Placement Dashboard

A React dashboard for tracking placement openings, applications, interviews and results.
It runs entirely in the browser with a built-in mock API (data saved in `localStorage`), so there is no backend to set up.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

**Demo login:** `demo@college.edu` / `Demo@1234`  (or register a new account with a `.edu`, `.edu.in` or `.ac.in` email).
Profile → "Reset demo data" restores the sample data.

## Features

| Area | What's included |
|---|---|
| Authentication | Login, registration (name, roll no., college email, branch, CGPA, strong password + confirm), profile editing (phone, skills, resume link), protected routes |
| Opportunities | Job list, search (company / role / skill, debounced), filters (type, location, branch, package, deadline, eligible only, hide applied), sorting, job details, eligibility check, apply modal |
| Tracking | Applications table with status tabs and a 4-step progress tracker, interview schedule (upcoming and completed), selection status |
| Analytics | Stat cards, status donut chart, placement trends (yearly bar + line, monthly bar), upcoming deadlines, next-interview banner |
| Notifications | Interview alerts, company updates, announcements, unread badges, mark read / mark all read |
| Responsive | Sidebar becomes a slide-in drawer under 768px, job grid uses `auto-fill`, table becomes stacked cards on mobile |

## Technical requirements → where to find them

| Requirement | Location |
|---|---|
| React components | `src/components/**`, `src/pages/**` |
| React Router | `src/routes/AppRoutes.jsx`, `src/components/layout/ProtectedRoute.jsx` (nested routes, params, redirects, protected + public-only routes) |
| Hooks | `src/hooks/` (`useFetch`, `useForm`, `useDebounce`, `useLocalStorage`) plus `useMemo`, `useCallback`, `useEffect`, `useState` throughout |
| Context API | `src/context/` (`AuthContext`, `ApplicationsContext`, `NotificationContext`) |
| API integration | `src/api/` (async functions with simulated latency and error handling), consumed through `useFetch` and the contexts |
| Responsive design | `src/styles.css` (breakpoints at 1000px, 768px, 480px) |
| Form validation | `src/utils/validators.js` + `src/hooks/useForm.js`, used in Login, Register, Profile, Apply modal |

## Project structure

```
src/
├── api/          mockDb.js (seed data + localStorage), auth.js, jobs.js, applications.js, notifications.js, stats.js
├── context/      AuthContext, ApplicationsContext, NotificationContext
├── hooks/        useFetch, useForm, useDebounce, useLocalStorage
├── components/
│   ├── layout/   Layout (sidebar + topbar), ProtectedRoute
│   ├── common/   Badge, Field, Icon, Loader, EmptyState, ErrorState, Modal, StatusStepper
│   ├── jobs/     JobCard, JobFilters, ApplyModal
│   └── charts/   ApplicationStatusChart, PlacementTrendChart
├── pages/        Login, Register, Dashboard, Jobs, JobDetails, Applications, Interviews, Notifications, Profile, NotFound
├── routes/       AppRoutes.jsx
└── utils/        validators, formatters, eligibility, constants
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/login`, `/register` | Auth | Public only |
| `/` | Dashboard | Protected |
| `/jobs`, `/jobs/:id` | Openings, details + apply | Protected |
| `/applications` | Applications + status | Protected |
| `/interviews` | Interview schedule | Protected |
| `/notifications` | Notifications | Protected |
| `/profile` | Profile | Protected |

## Data shapes

```js
job          { id, company, role, type, location, package, deadline, eligibleBranches, minCgpa, skills, description }
application  { id, jobId, studentId, status, appliedOn, note, interview: { date, mode, link, venue } | null }
notification { id, studentId, type: 'interview' | 'company' | 'announcement', message, date, read }
```

Status flow: `Applied → Shortlisted → Interview Scheduled → Selected | Rejected`

## Connecting a real backend later

Only the files in `src/api/` talk to data. Replace each function body with an `axios`/`fetch` call that returns the
same shape, for example:

```js
// src/api/jobs.js
import axios from 'axios';
const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });
export const listJobs = () => http.get('/jobs').then((r) => r.data);
export const getJob = (id) => http.get(`/jobs/${id}`).then((r) => r.data);
```

Then store a JWT instead of the user id in `AuthContext` and add it in an axios request interceptor.
Passwords in the mock are stored in plain text for demo purposes only. A real backend must hash them.

## Deployment

- **Vercel:** import the repo. `vercel.json` already rewrites all routes to `index.html` so refreshing `/jobs` works.
- **Netlify:** `public/_redirects` handles the same rewrite. Build command `npm run build`, publish directory `dist`.

## Deliverables checklist

- [ ] Public GitHub repo with regular commits
- [ ] This README plus screenshots of each page in `docs/screens/`
- [ ] UI design screens (Figma or the screenshots above)
- [ ] Live URL (Vercel or Netlify)
- [ ] 3 to 5 minute demo: register → browse and filter → apply → track → dashboard → notifications
