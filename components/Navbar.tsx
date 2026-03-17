import Link from 'next/link';
import DropdownMenu, { type DropdownItem } from '@/components/DropdownMenu';

export type MenuKey = 'slotplanung' | 'schnellzugriff';

export type NavItem =
  | {
      kind: 'link';
      key: string;
      label: string;
      href: string;
    }
  | {
      kind: 'menu';
      key: MenuKey;
      label: string;
      items: DropdownItem[];
    };

type NavbarProps = {
  items: NavItem[];
  openMenu: MenuKey | null;
  onHoverOpen: (key: MenuKey) => void;
  onHoverClose: () => void;
  onClickMenu: (key: MenuKey) => void;
  onItemClick: () => void;
};

export default function Navbar({
  items,
  openMenu,
  onHoverOpen,
  onHoverClose,
  onClickMenu,
  onItemClick,
}: NavbarProps) {
  return (
    <div className="rounded-full bg-black px-3 py-2 shadow-[0_16px_34px_rgba(0,0,0,0.35)] sm:px-4">
      <ul className="flex items-center gap-1 sm:gap-2">
        {items.map((item) => {
          if (item.kind === 'link') {
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 sm:px-4 sm:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          const isOpen = openMenu === item.key;

          return (
            <li
              key={item.key}
              className="relative"
              onMouseEnter={() => onHoverOpen(item.key)}
              onMouseLeave={onHoverClose}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={() => onClickMenu(item.key)}
                className="rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 sm:px-4 sm:text-sm"
              >
                {item.label} <span aria-hidden="true">▾</span>
              </button>

              <DropdownMenu items={item.items} open={isOpen} onItemClick={onItemClick} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
