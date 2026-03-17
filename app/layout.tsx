import './globals.css';
import type { Metadata } from 'next';
import { ProjectProvider } from '@/components/ProjectProvider';

export const metadata: Metadata = {
  title: 'Sonderwunsch Webapp',
  description: 'UI-Grundgerüst mit Startscreen, Navigation und Platzhalterseiten.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ProjectProvider>{children}</ProjectProvider>
      </body>
    </html>
  );
}
