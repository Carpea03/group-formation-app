import { NextResponse } from 'next/server';
import { isAdminRequest } from '../../../../lib/auth';
import { getRedisClient } from '../../../../lib/redis';

export async function POST(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY' }, { status: 500 });
  }

  try {
    const redis = await getRedisClient();

    const all = await redis.hGetAll('submissions');
    if (!all || Object.keys(all).length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 400 });
    }

    const submissions = Object.values(all)
      .map((v) => {
        try {
          return typeof v === 'string' ? JSON.parse(v) : v;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (submissions.length < 3) {
      return NextResponse.json({ error: 'Not enough submissions to form groups (minimum 3)' }, { status: 400 });
    }

    const profiles = submissions.map((s, i) => ({
      index: i + 1,
      name: s.fullName,
      studentId: s.studentId,
      aiExperience: s.aiExperience,
      preferredRole: s.preferredRole,
      skills: s.skills,
      industryInterest: s.industryInterest,
      aiApplicationInterests: s.aiApplicationInterests,
      availability: s.availability,
      deadlineApproach: s.deadlineApproach,
      peerPreference: s.peerPreference || null,
    }));

    const totalStudents = profiles.length;
    const targetGroupSize = 4;
    const numGroups = Math.round(totalStudents / targetGroupSize);

    const prompt = `You are helping a university lecturer form balanced project groups for an "AI for Business Transformation" course. There are ${totalStudents} students who need to be placed into approximately ${numGroups} groups of 3–4 students each.

Here are the student profiles:
${JSON.stringify(profiles, null, 2)}

Your task is to create balanced groups following these priorities (in order):
1. Mix AI experience levels — avoid placing all Beginners or all Experts together
2. Balance preferred roles — each group ideally has at least one Coordinator and one Researcher/Creative
3. Align on availability — group members should have overlapping available times
4. Match industry interests where possible — students with similar industry interests work better together
5. Respect peer preferences — honour any stated preferences/exclusions where feasible

Return ONLY a valid JSON object with this exact structure:
{
  "groups": [
    {
      "groupNumber": 1,
      "members": [
        { "name": "...", "studentId": "...", "role": "...", "aiExperience": "..." }
      ],
      "rationale": "Brief 1–2 sentence explanation of why this group works well",
      "industryFocus": "Suggested industry focus based on member interests"
    }
  ],
  "summary": "2–3 sentence overview of the grouping strategy used",
  "flaggedConsiderations": ["Any peer preferences or potential conflicts the lecturer should review"]
}

Do not include any text outside the JSON object.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Claude API error:', errText);
      return NextResponse.json({ error: 'AI service error — please try again.' }, { status: 500 });
    }

    const aiData = await response.json();
    const rawText = aiData.content?.[0]?.text || '';

    let groups;
    try {
      const cleaned = rawText.replace(/```json\n?|```\n?/g, '').trim();
      groups = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response:', rawText);
      return NextResponse.json({ error: 'Could not parse AI response. Please try again.' }, { status: 500 });
    }

    await redis.set(
      'generated_groups',
      JSON.stringify({
        groups,
        generatedAt: new Date().toISOString(),
        totalStudents,
      })
    );

    return NextResponse.json({ success: true, ...groups, generatedAt: new Date().toISOString(), totalStudents });
  } catch (error) {
    console.error('Generate groups error:', error);
    return NextResponse.json({ error: 'Server error — please try again.' }, { status: 500 });
  }
}

export async function GET(request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    const redis = await getRedisClient();
    const stored = await redis.get('generated_groups');
    if (!stored) return NextResponse.json({ groups: null });
    const data = typeof stored === 'string' ? JSON.parse(stored) : stored;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ groups: null });
  }
}
