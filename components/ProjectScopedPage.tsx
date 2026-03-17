'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';

type ProjectScopedPageProps = {
  title: string;
  description: string;
};

export default function ProjectScopedPage({ title, description }: ProjectScopedPageProps) {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : 'Unbekannt';
  }, [params]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">
        {title} - {projektId}
      </h1>
      <p className="mt-4 max-w-3xl text-base text-neutral-700">{description}</p>
    </section>
  );
}
