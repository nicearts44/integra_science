import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE, memeOrigine } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  const res = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
