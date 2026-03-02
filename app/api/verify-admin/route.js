import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD is not configured' }, { status: 500 });
    }

    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
