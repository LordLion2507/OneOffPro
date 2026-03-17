import KundenverwaltungClient from '@/components/companion/KundenverwaltungClient';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function KundenverwaltungPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const queryParam = resolvedSearchParams?.q;
  const query = Array.isArray(queryParam) ? queryParam[0] ?? '' : queryParam ?? '';

  return <KundenverwaltungClient key={query} initialQuery={query} />;
}
