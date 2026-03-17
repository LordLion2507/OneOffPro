import Link from 'next/link';
import type { ReactNode } from 'react';

type CockpitActionButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
};

const baseClassName =
  'flex w-full items-center justify-between rounded-xl bg-neutral-800 px-4 py-3 text-left text-sm font-semibold text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition hover:bg-neutral-700';

export default function CockpitActionButton({
  label,
  href,
  onClick,
  disabled,
  icon,
}: CockpitActionButtonProps) {
  if (href) {
    return (
      <Link href={href} className={baseClassName}>
        <span>{label}</span>
        {icon}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClassName} ${disabled ? 'cursor-not-allowed bg-neutral-500 text-neutral-200 hover:bg-neutral-500' : ''}`}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}
