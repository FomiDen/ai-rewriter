import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { key } = await request.json();
  const masterKey = process.env.ADMIN_KEY;

  if (!masterKey || key !== masterKey) {
    return NextResponse.json({ admin: false }, { status: 401 });
  }

  return NextResponse.json({ admin: true });
}
