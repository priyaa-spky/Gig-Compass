import { load, save, delay } from './mockDb';

export async function listNotifications(studentId) {
  await delay(200);
  return load()
    .notifications.filter((n) => n.studentId === studentId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function markRead(id) {
  const db = load();
  const n = db.notifications.find((x) => x.id === id);
  if (n) n.read = true;
  save(db);
}

export async function markAllRead(studentId) {
  const db = load();
  db.notifications.forEach((n) => {
    if (n.studentId === studentId) n.read = true;
  });
  save(db);
}
