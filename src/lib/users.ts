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
    // Return fallback users for production
    return [
      {
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        password: "$2a$10$8K1p/a0dRTlF6.8AqXz5eO0G6q5kQ6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q", // admin123
        role: "admin"
      },
      {
        id: "2", 
        name: "User",
        email: "user@example.com",
        password: "$2a$10$8K1p/a0dRTlF6.8AqXz5eO0G6q5kQ6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q6Q", // user123
        role: "user"
      }
    ];
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function validatePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}