import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  cookies().delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
