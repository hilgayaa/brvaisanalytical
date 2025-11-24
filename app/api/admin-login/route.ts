// app/api/admin-login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_pass", ADMIN_PASSWORD, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
