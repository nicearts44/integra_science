import { NextResponse, type NextRequest } from "next/server";

import { fermerSession, memeOrigine } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!memeOrigine(req)) {
    return NextResponse.json({ ok: false, error: "Origine refusée." }, { status: 403 });
  }

  return fermerSession(NextResponse.redirect(new URL("/admin/login", req.url), 303));
}
