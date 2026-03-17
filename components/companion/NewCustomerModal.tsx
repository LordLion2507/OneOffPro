'use client';

import { useState } from 'react';
import { emptyCustomer, type CustomerFormData } from '@/data/companion';
import CustomerForm from '@/components/companion/CustomerForm';

export default function NewCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState<CustomerFormData>(emptyCustomer);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-black bg-white p-5 shadow-2xl">
        <h2 className="text-2xl font-semibold text-black">Neuer Kunde</h2>
        <div className="mt-4">
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

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100">Abbrechen</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">Speichern</button>
        </div>
      </div>
    </div>
  );
}
