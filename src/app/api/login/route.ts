import { NextResponse } from "next/server";
import { validateCredentials, createSessionValue, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = validateCredentials(username, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const cookieValue = createSessionValue(user);

    const res = NextResponse.json({ ok: true, role: user.role });

    res.cookies.set({
      name: COOKIE_NAME,
      value: cookieValue,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
      sameSite: 'lax'
    });

    return res;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}