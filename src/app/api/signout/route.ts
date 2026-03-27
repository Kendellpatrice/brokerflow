import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("session", "", { httpOnly: true, sameSite: "strict", maxAge: 0, path: "/" });
  response.cookies.set("uid", "", { httpOnly: true, sameSite: "strict", maxAge: 0, path: "/" });
  response.cookies.set("leadRef", "", { maxAge: 0, path: "/" });
  return response;
}
