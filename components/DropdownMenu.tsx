import Link from 'next/link';

export type DropdownItem = {
  label: string;
  href: string;
  projectId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (projectId: string) => void;
};

type DropdownMenuProps = {
  items: DropdownItem[];
  open: boolean;
  onItemClick?: () => void;
};

export default function DropdownMenu({ items, open, onItemClick }: DropdownMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute left-1/2 top-full z-50 mt-3 w-max min-w-[260px] -translate-x-1/2 overflow-hidden rounded-2xl border border-black/10 bg-white p-2 shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.href}`}
          className="group flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-neutral-100"
        >
          <Link
            href={item.href}
            onClick={onItemClick}
            className="block flex-1 rounded-lg px-2 py-1 text-sm font-medium text-black"
          >
            {item.label}
          </Link>

          {item.projectId && item.onToggleFavorite ? (
            <button
              type="button"
              aria-label={`Favorit umschalten für ${item.label}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                item.onToggleFavorite?.(item.projectId!);
              }}
              className={`rounded-md p-1 transition ${
                item.isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <StarIcon active={Boolean(item.isFavorite)} />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={active ? '#111111' : '#ffffff'}
      stroke="#111111"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 3.7l2.57 5.2 5.74.84-4.16 4.05.98 5.72L12 16.78l-5.13 2.7.98-5.72L3.7 9.74l5.74-.84L12 3.7z" />
    </svg>
  );
}
