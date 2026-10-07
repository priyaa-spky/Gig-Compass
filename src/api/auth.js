import { load, save, delay, uid } from './mockDb';

const strip = ({ password, ...user }) => user;

export async function login(email, password) {
  await delay();
  const user = load().users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error('Incorrect email or password');
  return { user: strip(user), token: user.id };
}

export async function register(data) {
  await delay();
  const db = load();
  const email = data.email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('An account with this email already exists');
  }
  if (db.users.some((u) => u.rollNo.toLowerCase() === data.rollNo.trim().toLowerCase())) {
    throw new Error('This roll number is already registered');
  }
  const user = {
    id: uid('u'),
    name: data.name.trim(),
    email,
    password: data.password, // demo only: a real backend must hash passwords
    rollNo: data.rollNo.trim().toUpperCase(),
    branch: data.branch,
    cgpa: Number(data.cgpa),
    phone: '',
    skills: [],
    resumeLink: '',
    about: '',
  };
  db.users.push(user);
  db.notifications.unshift({
    id: uid('n'),
    studentId: user.id,
    type: 'announcement',
    message: 'Welcome to Placement Desk. Add your skills and resume link in Profile to get started.',
    date: new Date().toISOString(),
    read: false,
  });
  save(db);
  return { user: strip(user), token: user.id };
}

export async function getMe(token) {
  await delay(150);
  const user = load().users.find((u) => u.id === token);
  if (!user) throw new Error('Session expired');
  return strip(user);
}

export async function updateProfile(id, patch) {
  await delay();
  const db = load();
  const idx = db.users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error('User not found');
  db.users[idx] = { ...db.users[idx], ...patch };
  save(db);
  return strip(db.users[idx]);
}
