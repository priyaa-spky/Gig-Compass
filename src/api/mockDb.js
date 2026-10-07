// A tiny fake backend persisted in localStorage so the app works with no server.
// To move to a real backend, replace the functions in the other files in this folder
// with axios/fetch calls that return the same shapes. Nothing else in the app changes.

const KEY = 'placement_desk_db_v1';

export const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));
export const uid = (p) => `${p}${Math.random().toString(36).slice(2, 8)}`;

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const inDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return ymd(d);
};
const at = (n, time) => `${inDays(n)}T${time}`;
const hoursAgo = (h) => new Date(Date.now() - h * 3600e3).toISOString();

function seed() {
  const ALL = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];
  const jobs = [
    { id: 'j1', company: 'Nimbus Cloud', role: 'Backend Engineer', type: 'Full-time', location: 'Bengaluru', package: 14, deadline: inDays(9), eligibleBranches: ['CSE', 'IT'], minCgpa: 7.5, skills: ['Node.js', 'AWS', 'SQL'], description: 'Build and scale the APIs behind a cloud storage platform. You will own services end to end, from design review to on-call.' },
    { id: 'j2', company: 'Orbit Payments', role: 'Software Engineer', type: 'Full-time', location: 'Chennai', package: 12, deadline: inDays(4), eligibleBranches: ['CSE', 'IT', 'ECE'], minCgpa: 7.0, skills: ['Java', 'Spring', 'Kafka'], description: 'Work on payment routing and reconciliation systems used by thousands of merchants.' },
    { id: 'j3', company: 'Kavya Analytics', role: 'Data Analyst', type: 'Full-time', location: 'Hyderabad', package: 8, deadline: inDays(12), eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'], minCgpa: 6.5, skills: ['Python', 'SQL', 'Power BI'], description: 'Turn retail and logistics data into dashboards and decisions for client teams.' },
    { id: 'j4', company: 'Tessera Labs', role: 'Frontend Developer', type: 'Full-time', location: 'Remote', package: 10, deadline: inDays(2), eligibleBranches: ['CSE', 'IT'], minCgpa: 7.0, skills: ['React', 'TypeScript', 'CSS'], description: 'Ship accessible, fast interfaces for a design-tool startup. Strong React fundamentals matter more than years of experience.' },
    { id: 'j5', company: 'Greenleaf Energy', role: 'Graduate Engineer Trainee', type: 'Full-time', location: 'Pune', package: 6.5, deadline: inDays(-3), eligibleBranches: ['EEE', 'MECH', 'CIVIL'], minCgpa: 6.5, skills: ['Power systems', 'AutoCAD'], description: 'Two-year rotational programme across solar and wind installations.' },
    { id: 'j6', company: 'Atlas Logistics', role: 'Operations Analyst', type: 'Full-time', location: 'Mumbai', package: 7, deadline: inDays(15), eligibleBranches: ALL, minCgpa: 6.0, skills: ['Excel', 'Analytics'], description: 'Optimise routes and warehouse flow for a national freight network.' },
    { id: 'j7', company: 'BlueHarbor Bank', role: 'Technology Analyst', type: 'Full-time', location: 'Mumbai', package: 11, deadline: inDays(6), eligibleBranches: ['CSE', 'IT', 'ECE'], minCgpa: 8.5, skills: ['Java', 'Databases'], description: 'Join the core banking engineering team. Includes a three-month paid onboarding programme.' },
    { id: 'j8', company: 'Pixelforge Studios', role: 'Game Developer Intern', type: 'Internship', location: 'Chennai', package: 5, deadline: inDays(20), eligibleBranches: ['CSE', 'IT'], minCgpa: 6.5, skills: ['C++', 'Unity'], description: 'Six-month internship on a mobile game team, with a pre-placement offer for strong performers.' },
    { id: 'j9', company: 'Meridian Health Tech', role: 'QA Engineer', type: 'Full-time', location: 'Coimbatore', package: 6, deadline: inDays(11), eligibleBranches: ['CSE', 'IT', 'ECE'], minCgpa: 6.5, skills: ['Selenium', 'Testing'], description: 'Test clinical workflow software where reliability is non-negotiable.' },
    { id: 'j10', company: 'Zephyr Aerospace', role: 'Embedded Systems Engineer', type: 'Full-time', location: 'Bengaluru', package: 13, deadline: inDays(7), eligibleBranches: ['ECE', 'EEE', 'CSE'], minCgpa: 8.0, skills: ['C', 'RTOS', 'Embedded'], description: 'Write flight-control firmware and test it on hardware-in-the-loop rigs.' },
    { id: 'j11', company: 'Sutra Retail', role: 'Product Intern', type: 'Internship', location: 'Remote', package: 4, deadline: inDays(1), eligibleBranches: ALL, minCgpa: 6.0, skills: ['Research', 'Communication'], description: 'Support the product team with user research, specs and launch checklists.' },
    { id: 'j12', company: 'Cobalt Security', role: 'Security Analyst', type: 'Full-time', location: 'Hyderabad', package: 9, deadline: inDays(18), eligibleBranches: ['CSE', 'IT', 'ECE'], minCgpa: 7.0, skills: ['Networking', 'Linux', 'SIEM'], description: 'Monitor, triage and respond to incidents for enterprise clients in a 24x7 operations centre.' },
    { id: 'j13', company: 'Lumen EdTech', role: 'Full Stack Developer', type: 'Full-time', location: 'Remote', package: 9.5, deadline: inDays(14), eligibleBranches: ['CSE', 'IT'], minCgpa: 7.0, skills: ['React', 'Node.js', 'MongoDB'], description: 'Build learning tools used by schools across the country, from classroom dashboards to parent apps.' },
    { id: 'j14', company: 'Ironbridge Infra', role: 'Site Engineer', type: 'Full-time', location: 'Chennai', package: 5.5, deadline: inDays(8), eligibleBranches: ['CIVIL', 'MECH'], minCgpa: 6.0, skills: ['AutoCAD', 'Site management'], description: 'Supervise structural works on metro and highway projects.' },
  ];

  const demo = {
    id: 'u1', name: 'Aarav Menon', email: 'demo@college.edu', password: 'Demo@1234',
    rollNo: '21CS1042', branch: 'CSE', cgpa: 8.4, phone: '9876543210',
    skills: ['React', 'JavaScript', 'Python', 'SQL'], resumeLink: 'https://example.com/aarav-resume.pdf',
    about: 'Final-year CSE student interested in frontend and product engineering.',
  };

  const applications = [
    { id: 'a1', jobId: 'j1', studentId: 'u1', status: 'Applied', appliedOn: inDays(-2), note: '', interview: null },
    { id: 'a2', jobId: 'j13', studentId: 'u1', status: 'Shortlisted', appliedOn: inDays(-6), note: '', interview: null },
    { id: 'a3', jobId: 'j2', studentId: 'u1', status: 'Interview Scheduled', appliedOn: inDays(-9), note: '', interview: { date: at(2, '10:30'), mode: 'Online', link: 'https://meet.example.com/orbit-round-2', venue: '' } },
    { id: 'a4', jobId: 'j4', studentId: 'u1', status: 'Interview Scheduled', appliedOn: inDays(-8), note: '', interview: { date: at(6, '14:00'), mode: 'On-campus', link: '', venue: 'Placement Cell, Seminar Hall B' } },
    { id: 'a5', jobId: 'j3', studentId: 'u1', status: 'Selected', appliedOn: inDays(-25), note: '', interview: { date: at(-12, '11:00'), mode: 'Online', link: 'https://meet.example.com/kavya-final', venue: '' } },
    { id: 'a6', jobId: 'j9', studentId: 'u1', status: 'Rejected', appliedOn: inDays(-20), note: '', interview: { date: at(-5, '15:30'), mode: 'On-campus', link: '', venue: 'Block C, Room 204' } },
  ];

  const notifications = [
    { id: 'n1', studentId: 'u1', type: 'interview', message: 'Orbit Payments confirmed your technical round. Check the Interviews page for the meeting link.', date: hoursAgo(3), read: false },
    { id: 'n2', studentId: 'u1', type: 'announcement', message: 'Pre-placement talk for final-year students is on Friday at 4 PM in the main auditorium. Attendance is mandatory.', date: hoursAgo(9), read: false },
    { id: 'n3', studentId: 'u1', type: 'company', message: 'Nimbus Cloud added an online coding round before the interview stage.', date: hoursAgo(27), read: false },
    { id: 'n4', studentId: 'u1', type: 'interview', message: 'Tessera Labs scheduled an on-campus interview. Venue and time are on the Interviews page.', date: hoursAgo(50), read: true },
    { id: 'n5', studentId: 'u1', type: 'company', message: 'Lumen EdTech shortlisted your application for Full Stack Developer.', date: hoursAgo(78), read: true },
    { id: 'n6', studentId: 'u1', type: 'announcement', message: 'Update your resume link in Profile before applying. Applications without one may be skipped.', date: hoursAgo(120), read: true },
    { id: 'n7', studentId: 'u1', type: 'company', message: 'Congratulations! Kavya Analytics has extended you an offer for Data Analyst.', date: hoursAgo(250), read: true },
  ];

  const trends = {
    yearly: [
      { year: '2020', registered: 420, placed: 301, avgPackage: 5.2 },
      { year: '2021', registered: 430, placed: 318, avgPackage: 5.6 },
      { year: '2022', registered: 445, placed: 356, avgPackage: 6.4 },
      { year: '2023', registered: 452, placed: 371, avgPackage: 7.1 },
      { year: '2024', registered: 460, placed: 402, avgPackage: 7.8 },
      { year: '2025', registered: 468, placed: 419, avgPackage: 8.5 },
    ],
    monthly: [
      { label: 'Aug', offers: 14 }, { label: 'Sep', offers: 38 }, { label: 'Oct', offers: 61 },
      { label: 'Nov', offers: 88 }, { label: 'Dec', offers: 72 }, { label: 'Jan', offers: 54 },
      { label: 'Feb', offers: 41 }, { label: 'Mar', offers: 23 },
    ],
  };

  return { users: [demo], jobs, applications, notifications, trends };
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* fall through to seed */
  }
  const db = seed();
  save(db);
  return db;
}

export function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full or unavailable */
  }
}

export function resetDb() {
  localStorage.removeItem(KEY);
}
