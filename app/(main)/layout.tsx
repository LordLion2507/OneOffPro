import type { ReactNode } from 'react';
import Headbar from '@/components/Headbar';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[url('/Hintergrund.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <Headbar />
      <main>{children}</main>
    </div>
  );
}
