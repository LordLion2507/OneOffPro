'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomerLoadingState from '@/components/companion/CustomerLoadingState';

export default function CustomerSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const runSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    router.push(`/companion/kundenverwaltung?q=${encodeURIComponent(query.trim())}`);
  };

  if (loading) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center justify-center px-6 py-10">
        <CustomerLoadingState />
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-start justify-center px-6 pt-20 pb-10 sm:pt-24">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">Companion</h1>
        <div className="mt-9 sm:mt-10">
          <input
            type="text"
            placeholder="Suche starten ..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void runSearch();
              }
            }}
            className="w-full rounded-2xl border border-black/15 bg-white px-6 py-4 text-base text-black shadow-[0_8px_20px_rgba(0,0,0,0.08)] outline-none transition placeholder:text-black/45 focus:border-black/30"
          />
        </div>
      </div>
    </section>
  );
}
