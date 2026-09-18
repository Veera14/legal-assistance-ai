import type {Metadata} from 'next';
import './globals.css';
import { AriaLiveAnnouncerProvider } from '@/components/AriaLiveAnnouncer';

export const metadata: Metadata = {
  title: 'Legal Document Assistant & Navigator',
  description: 'GenAI-powered legal literacy assistant to simplify complex contracts, compare agreements side-by-side, highlight critical risks and obligations, answer grounded questions, and generate lawyer consultation packets.',
  openGraph: {
    title: 'Legal Document Assistant & Navigator',
    description: 'GenAI-powered legal literacy assistant to simplify complex contracts, compare agreements side-by-side, highlight critical risks and obligations, answer grounded questions, and generate lawyer consultation packets.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Document Assistant & Navigator',
    description: 'GenAI-powered legal literacy assistant to simplify complex contracts, compare agreements side-by-side, highlight critical risks and obligations, answer grounded questions, and generate lawyer consultation packets.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-hidden"
        >
          Skip to main content
        </a>
        <AriaLiveAnnouncerProvider>
          {children}
        </AriaLiveAnnouncerProvider>
      </body>
    </html>
  );
}
