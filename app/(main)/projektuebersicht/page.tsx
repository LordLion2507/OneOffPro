'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';
import { useProjectSelection } from '@/components/ProjectProvider';

export default function ProjektuebersichtPage() {
  const router = useRouter();
  const { setSelectedProject } = useProjectSelection();
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((row) => {
      if (normalizedQuery.length === 0) {
        return true;
      }

      return (
        row.projectId.toLowerCase().includes(normalizedQuery) ||
        row.kunde.toLowerCase().includes(normalizedQuery) ||
        row.werksunikat.toLowerCase().includes(normalizedQuery) ||
        row.projektleiter.toLowerCase().includes(normalizedQuery) ||
        row.produktentwickler.toLowerCase().includes(normalizedQuery) ||
        row.kundenberater.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [query]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Projektübersicht</h1>

      <div className="mt-8">
        <label htmlFor="projekt-suche" className="mb-2 block text-sm font-semibold text-black">
          Projekt suchen (ProjektNr. / Kunde / Werksunikat)
        </label>
        <input
          id="projekt-suche"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="z. B. OC1, Luca Trazzi"
          className="w-full rounded-xl border border-black/10 bg-neutral-200 px-4 py-3 text-black outline-none transition placeholder:text-black/50 focus:border-black/30"
        />
      </div>

      <div className="mt-7 overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="min-w-full border-collapse text-left text-sm text-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-4 py-3 font-bold">ProjektNr.</th>
              <th className="px-4 py-3 font-bold">Kunde</th>
              <th className="px-4 py-3 font-bold">Werksunikat</th>
              <th className="px-4 py-3 font-bold">Projektleiter</th>
              <th className="px-4 py-3 font-bold">Produktentwickler</th>
              <th className="px-4 py-3 font-bold">Kundenberater</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={row.projectId}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedProject(row.projectId);
                  router.push(`/projektuebersicht/cockpit/${row.projectId}`);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedProject(row.projectId);
                    router.push(`/projektuebersicht/cockpit/${row.projectId}`);
                  }
                }}
                className="cursor-pointer border-t border-neutral-200 bg-white hover:bg-neutral-100"
              >
                <td className="px-4 py-3">{row.projectId}</td>
                <td className="px-4 py-3">{row.kunde}</td>
                <td className="px-4 py-3">{row.werksunikat}</td>
                <td className="px-4 py-3">{row.projektleiter}</td>
                <td className="px-4 py-3">{row.produktentwickler}</td>
                <td className="px-4 py-3">{row.kundenberater}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
