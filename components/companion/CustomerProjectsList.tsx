import Link from 'next/link';
import type { CustomerProjectItem } from '@/data/companion';

export default function CustomerProjectsList({ items }: { items: CustomerProjectItem[] }) {
  return (
    <div className="flex h-[300px] flex-col overflow-hidden rounded-xl border border-black/15 bg-white">
      <div className="bg-black px-3 py-2 text-sm font-semibold text-white">Kundenprojekte</div>
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/companion/kundenverwaltung/projekt/${encodeURIComponent(item.projektId)}`}
            className="w-full rounded-lg border border-black/10 bg-neutral-50 px-3 py-2 text-left text-xs text-black transition hover:bg-neutral-100"
          >
            <div className="font-semibold">{item.projektName}</div>
            <div className="mt-1 text-black/75">{item.type} | {item.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
