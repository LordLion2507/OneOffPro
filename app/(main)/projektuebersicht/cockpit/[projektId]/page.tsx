'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type ContentLink = {
  label: string;
  href: string;
};

export default function ProjektCockpitPage() {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : 'OCx';
  }, [params]);

  const contentLinks: ContentLink[] = [
    { label: 'Änderungsliste', href: `/projektuebersicht/${projektId}/aenderungsliste` },
    { label: 'Projektplan', href: `/projektuebersicht/${projektId}/projektplan` },
    { label: 'Kalkulation', href: `/projektuebersicht/${projektId}/kalkulation` },
    { label: 'Kostentracking', href: `/projektuebersicht/${projektId}/kostentracking` },
    { label: 'LOP', href: `/projektuebersicht/${projektId}/lop` },
    { label: 'CPM', href: `/projektuebersicht/${projektId}/cpm` },
    { label: 'Laufwerk', href: `/projektuebersicht/${projektId}/laufwerk` },
    { label: 'Aftersales', href: `/projektuebersicht/${projektId}/aftersales` },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Cockpit - {projektId}</h1>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-black/20 bg-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.12)] md:min-h-[260px]">
            <div className="bg-black px-4 py-2">
              <h2 className="text-base font-semibold text-white">Basis Information</h2>
            </div>
            <div className="space-y-3 px-4 py-4 text-sm text-black sm:text-base">
              <p>
                <span className="font-semibold">Projektname:</span> Sonderwunsch Projekt {projektId}
              </p>
              <p>
                <span className="font-semibold">Kunde:</span> Musterkunde GmbH
              </p>
              <p>
                <span className="font-semibold">VIN:</span> WP0ZZZ99ZTS{projektId.replace('OC', '0')}
              </p>
              <p>
                <span className="font-semibold">Auftragsnummer:</span> AUF-{projektId}
              </p>
              <p>
                <span className="font-semibold">IWAS:</span> IW-{projektId}
              </p>
            </div>
          </div>

          <VisuImageCard src={`/${projektId}.jpeg`} alt={`VISU außen ${projektId}`} minHeight="md:min-h-[260px]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex min-h-[470px] flex-col overflow-hidden rounded-2xl border border-black/20 bg-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.12)] md:min-h-[470px]">
            <div className="bg-black px-4 py-2">
              <h2 className="text-base font-semibold text-white">Content</h2>
            </div>
            <div className="flex flex-1 flex-col gap-2 px-4 py-4">
              {contentLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100 hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <VisuImageCard
            src={`/${projektId}innen.jpeg`}
            alt={`VISU innen ${projektId}`}
            minHeight="md:min-h-[470px]"
          />
        </div>
      </div>
    </section>
  );
}

function VisuImageCard({ src, alt, minHeight }: { src: string; alt: string; minHeight: string }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-black/20 bg-white/85 shadow-[0_10px_24px_rgba(0,0,0,0.12)] min-h-[260px] ${minHeight}`}
    >
      {hasError ? (
        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-black/70">
          Keine Visualisierung verfügbar
        </div>
      ) : (
        <Image src={src} alt={alt} fill unoptimized className="object-cover" onError={() => setHasError(true)} />
      )}
    </div>
  );
}
