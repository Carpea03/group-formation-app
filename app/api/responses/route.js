import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../lib/auth';
import { getRedisClient } from '../../../lib/redis';

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const redis = await getRedisClient();
    const all = await redis.hGetAll('submissions');

    const submissions = Object.values(all || {})
      .map((value) => {
        try {
          return typeof value === 'string' ? JSON.parse(value) : value;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Responses error:', error);
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 });
  }
}
