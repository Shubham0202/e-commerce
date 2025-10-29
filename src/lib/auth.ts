// src/lib/auth.ts

export const COOKIE_NAME = "session";

export type SimpleUser = {
  username: string;
  password: string;
  role: "admin" | "user";
};

// Dummy users
export const USERS: SimpleUser[] = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
];

export function validateCredentials(username: string, password: string): SimpleUser | null {
  const user = USERS.find(u => u.username === username && u.password === password);
  return user ?? null;
}

// Convert to cookie string
export function createSessionValue(user: SimpleUser) {
  // plain string: "username|role"
  return `${user.username}|${user.role}`;
}

// Parse cookie string
export function parseSessionValue(value?: string | null) {
  if (!value) return null;
  const [username, role] = value.split("|");
  if (!username || !role) return null;
  return { username, role };
}
