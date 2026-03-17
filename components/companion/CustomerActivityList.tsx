type Item = { id: string; datum: string; uhrzeit: string; typ: string; betreff: string };

export default function CustomerActivityList({ items }: { items: Item[] }) {
  return (
    <div className="flex h-[300px] flex-col overflow-hidden rounded-xl border border-black/15 bg-white">
      <div className="bg-black px-3 py-2 text-sm font-semibold text-white">Kundenaktivität</div>
      <div className="flex-1 space-y-2 overflow-auto p-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="w-full rounded-lg border border-black/10 bg-neutral-50 px-3 py-2 text-left text-xs text-black transition hover:bg-neutral-100"
          >
            <div className="font-medium">{item.datum} | {item.uhrzeit}</div>
            <div className="mt-1 text-black/80">{item.typ} | {item.betreff}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
