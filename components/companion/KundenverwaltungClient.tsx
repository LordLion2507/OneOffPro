'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  activityItems,
  emptyCustomer,
  lucaTrazziData,
  projectItems,
  type CustomerFormData,
} from '@/data/companion';
import CustomerForm from '@/components/companion/CustomerForm';
import CustomerProjectsList from '@/components/companion/CustomerProjectsList';
import CustomerActivityList from '@/components/companion/CustomerActivityList';
import NewCustomerModal from '@/components/companion/NewCustomerModal';

type KundenverwaltungClientProps = {
  initialQuery: string;
};

export default function KundenverwaltungClient({ initialQuery }: KundenverwaltungClientProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalVersion, setModalVersion] = useState(0);

  const initialData = useMemo(() => {
    const query = initialQuery.trim().toLowerCase();
    if (query === 'luca trazzi') {
      return lucaTrazziData;
    }
    return { ...emptyCustomer, vorname: query ? initialQuery : '' };
  }, [initialQuery]);

  const [formData, setFormData] = useState<CustomerFormData>(initialData);

  return (
    <section className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10">
      <div className="rounded-xl bg-black px-5 py-3 text-white shadow-lg">
        <h1 className="text-2xl font-semibold">Kundenverwaltung</h1>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-black/15 bg-white/90 p-4 shadow-sm">
          <CustomerForm
            value={formData}
            onChange={(field, nextValue) =>
              setFormData((current) => ({
                ...current,
                [field]: nextValue,
              }))
            }
          />
        </div>

        <div className="space-y-4">
          <CustomerProjectsList items={projectItems} />
          <CustomerActivityList items={activityItems} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setModalVersion((current) => current + 1);
            setShowModal(true);
          }}
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Neuer Kunde
        </button>
        <button
          type="button"
          onClick={() => router.push('/companion')}
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Zurück
        </button>
        <button
          type="button"
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Speichern
        </button>
        <button
          type="button"
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Aktualisieren
        </button>
        <button
          type="button"
          className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Kunde löschen
        </button>
      </div>

      <NewCustomerModal key={modalVersion} open={showModal} onClose={() => setShowModal(false)} />
    </section>
  );
}
