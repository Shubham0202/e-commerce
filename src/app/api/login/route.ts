// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { validateCredentials, createSessionValue, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = validateCredentials(username, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieValue = createSessionValue(user);

  const res = NextResponse.json({ ok: true, role: user.role });

  res.headers.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${cookieValue}; Path=/; Max-Age=${24 * 60 * 60}; HttpOnly; SameSite=Lax`
  );

  return res;
}
