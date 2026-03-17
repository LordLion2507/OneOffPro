'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

const COLUMNS = [
  'Option',
  'CPM_Unterpunkt (UP)',
  'KEFAG',
  'Beschreibung des Sonderwunsches',
  'Beispiel-Bild',
  'Teilenummer',
  'Kategorie',
  'Regulatory evaluation',
  'BTV + Abteilung PE',
  'K-Freigabe',
  'Qualität (Name + Abteilung)',
  'Bemusterung',
  'BAL-relevant',
  'OC Ersatzteil-vorhalt',
  'Bemerkungen',
] as const;

const BASISINFORMATIONEN = [
  'Interne Projektnummer',
  'Projektmanagement',
  'Basisfahrzeug',
  'Fahrgestellnummer (FIN)',
  'Produktionsdatum',
  'Erstzulassung',
  'Markt',
  'Sonderwunsch Werksunikat',
  'CPM Nummer',
] as const;

const INHALTSVERZEICHNIS = [
  'OC Änderungsliste',
  'Projektspezifisch',
  'Projektspezifisch',
  'Projektspezifisch',
  'Projektspezifisch',
  'Projektspezifisch',
  'Projektspezifisch',
  'Projektspezifisch',
] as const;

const DECKBLATT_IMAGE_SRC = '/Deckblatt.jpeg?v=20260311';

export default function ProjectAenderungslistePage() {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : 'OCx';
  }, [params]);

  const rows = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        option: `${projektId}-${String(index + 1).padStart(3, '0')}`,
      })),
    [projektId]
  );

  const downloadAenderungsliste = () => {
    const header = COLUMNS.join(';');
    const body = rows
      .map((row) =>
        [
          row.option,
          ...Array.from({ length: COLUMNS.length - 1 }, () => ''),
        ].join(';')
      )
      .join('\n');

    const csv = `${header}\n${body}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projektId}_Aenderungsliste.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Änderungsliste - {projektId}</h1>

      <div className="mt-8 rounded-2xl border border-black/15 bg-white/92 p-6 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        <h2 className="text-center text-3xl font-bold tracking-tight text-black">
          {projektId} Porsche Werksunikat One-Off
        </h2>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <InfoTableCard
              title="Basisinformationen"
              rows={BASISINFORMATIONEN.map((label) => ({ label, value: '' }))}
            />
            <InfoTableCard
              title="Inhaltsverzeichnis"
              rows={INHALTSVERZEICHNIS.map((label) => ({ label, value: '' }))}
            />
          </div>

          <div className="rounded-2xl border border-emerald-700/35 bg-neutral-50 p-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-black/10 bg-white">
              <Image
                src={DECKBLATT_IMAGE_SRC}
                alt={`Deckblatt ${projektId}`}
                fill
                priority
                unoptimized
                sizes="(min-width: 1280px) 32vw, (min-width: 768px) 40vw, 90vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-black">Änderungsliste des {projektId}</h2>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/20 bg-white/88 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-[2200px] border-collapse text-left text-sm text-black">
              <thead>
                <tr className="bg-black text-white">
                  {COLUMNS.map((column) => (
                    <th
                      key={column}
                      className="sticky top-0 z-20 border-b border-black bg-black px-4 py-3 font-semibold"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={row.option}
                    className={`border-b border-neutral-200 transition hover:bg-neutral-100/80 ${
                      rowIndex % 2 === 0 ? 'bg-white/90' : 'bg-neutral-50/90'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-black">{row.option}</td>
                    {COLUMNS.slice(1).map((column) => (
                      <td key={`${row.option}-${column}`} className="px-4 py-3 text-black/80">
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={downloadAenderungsliste}
            className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Änderungsliste herunterladen
          </button>
        </div>
      </div>
    </section>
  );
}

function InfoTableCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="rounded-2xl border border-black/15 bg-neutral-50/90">
      <div className="border-b border-black/10 px-4 py-3">
        <h3 className="text-base font-semibold text-black">{title}</h3>
      </div>
      <div className="divide-y divide-black/10">
        {rows.map((row, index) => (
          <div key={`${title}-${index}-${row.label}`} className="grid grid-cols-[1.15fr_0.85fr]">
            <div className="px-4 py-3 text-sm font-medium text-black">{row.label}</div>
            <div className="min-h-11 border-l border-black/10 px-4 py-3 text-sm text-black/60">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
