'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SKILLS = [
  'Research and information gathering',
  'Business analysis and strategy',
  'Presentation design (PowerPoint, Canva, etc.)',
  'Writing and editing',
  'Public speaking and presenting',
  'Technical skills (data analysis, coding)',
  'Creative thinking and brainstorming',
  'Project management and organisation',
];

const AI_INTERESTS = [
  'Marketing and content creation',
  'Customer service and chatbots',
  'Data analysis and insights',
  'Process automation',
  'Product development and innovation',
  'Finance and business intelligence',
  'Healthcare applications',
  'Sustainability and social impact',
  'Education and learning',
  'Retail and e-commerce',
];

const AVAILABILITY = [
  'Weekday mornings (before 12pm)',
  'Weekday afternoons (12pm–5pm)',
  'Weekday evenings (after 5pm)',
  'Weekend mornings',
  'Weekend afternoons',
  'Very flexible — most times work for me',
];

const AI_TOOLS = [
  'ChatGPT',
  'Claude',
  'Google Gemini',
  'Microsoft Copilot',
  'Perplexity',
  'DALL-E or Midjourney (image generation)',
  'GitHub Copilot or other coding assistants',
  'None — I\'m new to AI tools',
];

const STEPS = [
  { number: 1, label: 'About You' },
  { number: 2, label: 'AI Background' },
  { number: 3, label: 'Working Style' },
  { number: 4, label: 'Project Preferences' },
];

function CheckboxGroup({ options, selected, onChange, cols = 1 }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };
  return (
    <div className={`grid gap-2 ${cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((opt) => (
        <label
          key={opt}
          className="flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors"
          style={{
            backgroundColor: selected.includes(opt) ? 'rgba(133,107,255,0.1)' : 'rgba(248,239,224,0.6)',
            border: selected.includes(opt) ? '1.5px solid #856BFF' : '1.5px solid #E0D9F5',
          }}
        >
          <input
            type="checkbox"
            className="au-checkbox mt-0.5 shrink-0"
            checked={selected.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#140F50' }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function RadioGroup({ options, selected, onChange }) {
  return (
    <div className="grid gap-2">
      {options.map((opt) => (
        <label
          key={opt.value || opt}
          className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors"
          style={{
            backgroundColor: selected === (opt.value || opt) ? 'rgba(133,107,255,0.1)' : 'rgba(248,239,224,0.6)',
            border: selected === (opt.value || opt) ? '1.5px solid #856BFF' : '1.5px solid #E0D9F5',
          }}
        >
          <input
            type="radio"
            className="au-radio shrink-0"
            checked={selected === (opt.value || opt)}
            onChange={() => onChange(opt.value || opt)}
          />
          <div>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: '#140F50', fontWeight: selected === (opt.value || opt) ? '600' : '400' }}>
              {opt.label || opt}
            </span>
            {opt.description && (
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '0.8rem', color: '#6B6490', marginTop: '2px' }}>
                {opt.description}
              </p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function LikertScale({ value, onChange, lowLabel, highLabel }) {
  return (
    <div>
      <div className="flex gap-2 justify-center mb-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="w-12 h-12 rounded-lg font-bold transition-all"
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '1rem',
              backgroundColor: value === n ? '#140F50' : 'white',
              color: value === n ? 'white' : '#140F50',
              border: value === n ? '2px solid #140F50' : '2px solid #E0D9F5',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs" style={{ fontFamily: 'Georgia, serif', color: '#6B6490' }}>
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    // Step 1
    fullName: '',
    studentId: '',
    email: '',
    // Step 2
    aiExperience: '',
    aiTools: [],
    skills: [],
    // Step 3
    preferredRole: '',
    availability: [],
    deadlineApproach: null,
    meetingPreference: null,
    // Step 4
    industryInterest: '',
    aiApplicationInterests: [],
    peerPreference: '',
  });

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
      if (!form.studentId.trim()) newErrors.studentId = 'Please enter your student ID.';
      if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Please enter a valid email address.';
    }
    if (step === 2) {
      if (!form.aiExperience) newErrors.aiExperience = 'Please select your experience level.';
      if (form.skills.length === 0) newErrors.skills = 'Please select at least one skill.';
    }
    if (step === 3) {
      if (!form.preferredRole) newErrors.preferredRole = 'Please select your preferred role.';
      if (form.availability.length === 0) newErrors.availability = 'Please select at least one availability window.';
      if (!form.deadlineApproach) newErrors.deadlineApproach = 'Please rate your deadline approach.';
    }
    if (step === 4) {
      if (!form.industryInterest.trim()) newErrors.industryInterest = 'Please describe your industry interest.';
      if (form.aiApplicationInterests.length === 0) newErrors.aiApplicationInterests = 'Please select at least one area.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/success');
      } else {
        alert(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error — please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl mb-2" style={{ color: '#140F50', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
          Group Formation Survey
        </h1>
        <p style={{ fontFamily: 'Georgia, serif', color: '#6B6490', fontSize: '1rem' }}>
          Assignment 2: AI Business Pitch &nbsp;·&nbsp; Takes about 5–7 minutes
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((s, i) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  fontFamily: 'Arial, sans-serif',
                  backgroundColor: step > s.number ? '#856BFF' : step === s.number ? '#140F50' : 'white',
                  color: step >= s.number ? 'white' : '#9E97C4',
                  border: step < s.number ? '2px solid #E0D9F5' : 'none',
                }}
              >
                {step > s.number ? '✓' : s.number}
              </div>
              <span className="text-xs mt-1 hidden sm:block" style={{ fontFamily: 'Arial, sans-serif', color: step === s.number ? '#140F50' : '#9E97C4', fontWeight: step === s.number ? 'bold' : 'normal' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-none w-8 h-0.5 mx-1 mb-4" style={{ backgroundColor: step > s.number ? '#856BFF' : '#E0D9F5' }} />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar mb-8">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Card */}
      <div className="card">
        {/* Step 1: About You */}
        {step === 1 && (
          <div>
            <h2 className="text-xl mb-1" style={{ color: '#140F50', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>About You</h2>
            <p className="mb-6 text-sm" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
              This information helps us identify you and communicate group assignments.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Full name <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <input
                  className="au-input"
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Student ID <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <input
                  className="au-input"
                  type="text"
                  placeholder="e.g. a1234567"
                  value={form.studentId}
                  onChange={(e) => update('studentId', e.target.value)}
                />
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  University email <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <input
                  className="au-input"
                  type="email"
                  placeholder="e.g. a1234567@adelaide.edu.au"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: AI Background */}
        {step === 2 && (
          <div>
            <h2 className="text-xl mb-1" style={{ color: '#140F50', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Your AI Background</h2>
            <p className="mb-6 text-sm" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
              We use this to ensure every group has a mix of experience levels — beginners and experienced students both contribute real value.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  How would you describe your current experience with AI tools? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <RadioGroup
                  selected={form.aiExperience}
                  onChange={(v) => update('aiExperience', v)}
                  options={[
                    { value: 'Beginner', label: 'Beginner', description: "I've just started exploring AI tools" },
                    { value: 'Intermediate', label: 'Intermediate', description: 'I use AI tools occasionally for specific tasks' },
                    { value: 'Advanced', label: 'Advanced', description: 'I regularly use AI and experiment with different approaches' },
                    { value: 'Expert', label: 'Expert', description: "I'm very comfortable with AI and have explored multiple tools in depth" },
                  ]}
                />
                {errors.aiExperience && <p className="text-red-500 text-xs mt-1">{errors.aiExperience}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Which AI tools have you used before? (Select all that apply)
                </label>
                <CheckboxGroup
                  options={AI_TOOLS}
                  selected={form.aiTools}
                  onChange={(v) => update('aiTools', v)}
                  cols={2}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  What skills can you contribute to your group? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <CheckboxGroup
                  options={SKILLS}
                  selected={form.skills}
                  onChange={(v) => update('skills', v)}
                  cols={2}
                />
                {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Working Style */}
        {step === 3 && (
          <div>
            <h2 className="text-xl mb-1" style={{ color: '#140F50', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Your Working Style</h2>
            <p className="mb-6 text-sm" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
              Understanding how you work best helps us create groups with complementary styles and compatible schedules.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Which role do you naturally gravitate towards in group projects? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <RadioGroup
                  selected={form.preferredRole}
                  onChange={(v) => update('preferredRole', v)}
                  options={[
                    { value: 'Leader/Coordinator', label: 'Leader / Coordinator', description: 'I like organising the team and keeping everyone on track' },
                    { value: 'Researcher/Analyst', label: 'Researcher / Analyst', description: 'I enjoy gathering information and analysing data' },
                    { value: 'Creative/Designer', label: 'Creative / Designer', description: 'I focus on presentation and visual elements' },
                    { value: 'Technical/Builder', label: 'Technical / Builder', description: 'I like working with tools and implementation' },
                    { value: 'Flexible', label: 'Flexible', description: "I'm happy to take on whatever role the team needs" },
                  ]}
                />
                {errors.preferredRole && <p className="text-red-500 text-xs mt-1">{errors.preferredRole}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  When are you generally available for group meetings? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <CheckboxGroup
                  options={AVAILABILITY}
                  selected={form.availability}
                  onChange={(v) => update('availability', v)}
                />
                {errors.availability && <p className="text-red-500 text-xs mt-1">{errors.availability}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  I prefer to complete assignments well before the deadline rather than closer to the due date. <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <LikertScale
                  value={form.deadlineApproach}
                  onChange={(v) => update('deadlineApproach', v)}
                  lowLabel="Strongly disagree"
                  highLabel="Strongly agree"
                />
                {errors.deadlineApproach && <p className="text-red-500 text-xs mt-1">{errors.deadlineApproach}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  I prefer to meet in person rather than online for group work.
                </label>
                <LikertScale
                  value={form.meetingPreference}
                  onChange={(v) => update('meetingPreference', v)}
                  lowLabel="Strongly disagree"
                  highLabel="Strongly agree"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Project Preferences */}
        {step === 4 && (
          <div>
            <h2 className="text-xl mb-1" style={{ color: '#140F50', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Your Project Preferences</h2>
            <p className="mb-6 text-sm" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
              Where possible, we'll group students with shared industry interests so your pitch genuinely excites your whole team.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block mb-1.5 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  What industry or business area would you like to focus your AI Business Pitch on? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <p className="text-xs mb-2" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
                  Be as specific as you like — e.g. "aged care technology", "sustainable fashion retail", "fintech for small business".
                </p>
                <textarea
                  className="au-input"
                  rows={3}
                  placeholder="Describe the industry or business area you're most interested in..."
                  value={form.industryInterest}
                  onChange={(e) => update('industryInterest', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
                {errors.industryInterest && <p className="text-red-500 text-xs mt-1">{errors.industryInterest}</p>}
              </div>

              <div>
                <label className="block mb-3 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Which AI application areas interest you most? <span style={{ color: '#856BFF' }}>*</span>
                </label>
                <CheckboxGroup
                  options={AI_INTERESTS}
                  selected={form.aiApplicationInterests}
                  onChange={(v) => update('aiApplicationInterests', v)}
                  cols={2}
                />
                {errors.aiApplicationInterests && <p className="text-red-500 text-xs mt-1">{errors.aiApplicationInterests}</p>}
              </div>

              <div>
                <label className="block mb-1.5 text-sm font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#140F50' }}>
                  Is there anyone you would particularly like to work with, or prefer not to work with? (Optional)
                </label>
                <p className="text-xs mb-2" style={{ color: '#6B6490', fontFamily: 'Georgia, serif' }}>
                  This is entirely optional and will be considered — but cannot always be guaranteed.
                </p>
                <textarea
                  className="au-input"
                  rows={2}
                  placeholder="Optional — only include if relevant..."
                  value={form.peerPreference}
                  onChange={(e) => update('peerPreference', e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className={`mt-8 flex ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button type="button" className="au-btn-secondary" onClick={handleBack}>
              ← Back
            </button>
          )}
          {step < 4 ? (
            <button type="button" className="au-btn-primary" onClick={handleNext}>
              Continue →
            </button>
          ) : (
            <button
              type="button"
              className="au-btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Survey ✓'}
            </button>
          )}
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-center text-xs mt-6" style={{ fontFamily: 'Georgia, serif', color: '#9E97C4' }}>
        Your responses are only used to form balanced project groups. They will not be shared with other students.
      </p>
    </div>
  );
}
