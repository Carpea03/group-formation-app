import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ maxWidth: '42rem', margin: '4rem auto', padding: '0 1rem', textAlign: 'center' }}>
      <h1 style={{ color: '#140F50', marginBottom: '0.75rem' }}>Submission received</h1>
      <p style={{ color: '#3B3570', marginBottom: '1.5rem' }}>
        Thank you. Your responses have been saved and will be used for group formation.
      </p>
      <Link href="/" style={{ color: '#1449FF', textDecoration: 'underline' }}>
        Return to survey
      </Link>
    </div>
  );
}
