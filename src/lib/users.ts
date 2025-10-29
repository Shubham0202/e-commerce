// src/lib/users.ts
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: "admin" | "user" | string;
};

const USERS_FILE = path.join(process.cwd(), "src", "data", "users.json");

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    const users = JSON.parse(raw) as StoredUser[];
    return users;
  } catch (err) {
    console.error("Error reading users.json", err);
    return [];
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function validatePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Optional helper to add a new user (hashes password)
export async function addUser(user: Omit<StoredUser, "id"> & { passwordPlain?: string }): Promise<StoredUser> {
  const users = await readUsers();
  const id = (users.length + 1).toString();
  const passwordPlain = user.passwordPlain ?? user.password;
  const hashed = await bcrypt.hash(passwordPlain ?? "", 10);
  const newUser: StoredUser = {
    id,
    name: user.name,
    email: user.email,
    password: hashed,
    role: user.role,
  };
  users.push(newUser);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  return newUser;
}
