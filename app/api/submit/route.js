import { NextResponse } from 'next/server';
import { getRedisClient } from '../../../../lib/redis';

function validateSubmission(data) {
  if (!data || typeof data !== 'object') return 'Invalid request payload.';
  if (!data.fullName?.trim()) return 'Please enter your full name.';
  if (!data.studentId?.trim()) return 'Please enter your student ID.';
  if (!data.email?.includes('@')) return 'Please enter a valid email address.';
  if (!data.aiExperience) return 'Please select your experience level.';
  if (!Array.isArray(data.skills) || data.skills.length === 0) return 'Please select at least one skill.';
  if (!data.preferredRole) return 'Please select your preferred role.';
  if (!Array.isArray(data.availability) || data.availability.length === 0) return 'Please select at least one availability window.';
  if (!data.deadlineApproach) return 'Please rate your deadline approach.';
  if (!data.industryInterest?.trim()) return 'Please describe your industry interest.';
  if (!Array.isArray(data.aiApplicationInterests) || data.aiApplicationInterests.length === 0) return 'Please select at least one area.';
  return null;
}

export async function POST(request) {
  try {
    const data = await request.json();
    const validationError = validateSubmission(data);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const submission = {
      fullName: data.fullName.trim(),
      studentId: data.studentId.trim(),
      email: data.email.trim(),
      aiExperience: data.aiExperience,
      aiTools: Array.isArray(data.aiTools) ? data.aiTools : [],
      skills: data.skills,
      preferredRole: data.preferredRole,
      availability: data.availability,
      deadlineApproach: data.deadlineApproach,
      meetingPreference: data.meetingPreference || null,
      industryInterest: data.industryInterest.trim(),
      aiApplicationInterests: data.aiApplicationInterests,
      peerPreference: data.peerPreference?.trim() || '',
      submittedAt: new Date().toISOString(),
    };

    const redis = await getRedisClient();
    await redis.hSet('submissions', submission.studentId.toLowerCase(), JSON.stringify(submission));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 });
  }
}
