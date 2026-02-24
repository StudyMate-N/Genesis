import './globals.css';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata = {
  title: 'Veritas Academy — Unlocking Your True Potential',
  description: 'Custom study plans tailored to your exact syllabus.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0 }}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
