import './globals.css';

export const metadata = {
  title: 'Group Formation App',
  description: 'AI for Business Transformation group formation survey',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
