'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';

const ATTENDEES = [
  'M. Al-Tani',
  'M. Eble',
  'G. Larson',
  'G. Greco',
  'R. Mozer',
  'M. Schoch',
  'K. Gangadharan',
  'E. Burik',
  'C. Hillers',
  'A. Schol',
  'W. Wesselok',
  'T. Schulz',
  'R. Gauss',
  'S. Epler',
  'S. Bulling',
] as const;

const COLUMNS = [
  'Nr.',
  'Kategorie',
  'Produktsubstanz',
  'Thema',
  'Aufgabe / Aktivität / Maßnahme',
  'Zuständig',
  'Zuständig 2',
  'Starttermin',
  'Zieltermin',
  'Fälligkeit',
  'Status',
  'Wiedervorlage',
] as const;

export default function ProjectLOPPage() {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : 'OCx';
  }, [params]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const rows = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
      })),
    []
  );

  return (
    <section className="mx-auto max-w-[1650px] px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">LOP - {projektId}</h1>

      <div className="mt-6 rounded-2xl border border-black/20 bg-white/90 p-5 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.4fr_0.5fr_2fr]">
          <Field label="Einberufen von">
            <input className={inputClassName()} defaultValue="" />
          </Field>
          <Field label="KW">
            <input className={inputClassName()} defaultValue="" />
          </Field>
          <Field label="Datum">
            <input type="date" className={inputClassName()} />
          </Field>
          <div className="rounded-xl border border-black/15 bg-neutral-50 p-4">
            <p className="text-sm font-semibold text-black">Anwesenheit</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {ATTENDEES.map((name) => (
                <label key={name} className="flex items-center gap-2 text-sm text-black">
                  <input
                    type="checkbox"
                    checked={attendance[name] ?? false}
                    onChange={(event) =>
                      setAttendance((current) => ({
                        ...current,
                        [name]: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded-none border border-black accent-black"
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/20 bg-white/90 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-[1900px] border-collapse text-left text-sm text-black">
            <thead>
              <tr className="bg-black text-white">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="sticky top-0 z-20 border-b border-black bg-black px-4 py-3 font-semibold"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className={`border-b border-neutral-200 transition hover:bg-neutral-100/80 ${
                    rowIndex % 2 === 0 ? 'bg-white/90' : 'bg-neutral-50/90'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-black">{row.id}</td>
                  <EditableCell />
                  <EditableCell />
                  <EditableCell />
                  <EditableCell multiline />
                  <EditableCell />
                  <EditableCell />
                  <EditableCell type="date" />
                  <EditableCell type="date" />
                  <EditableCell />
                  <EditableCell />
                  <EditableCell type="date" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-semibold text-black">{label}</span>
      {children}
    </label>
  );
}

function EditableCell({
  multiline = false,
  type = 'text',
}: {
  multiline?: boolean;
  type?: 'text' | 'date';
}) {
  return (
    <td className="px-3 py-2 align-top">
      {multiline ? (
        <textarea className={`${inputClassName()} min-h-20 resize-none`} />
      ) : (
        <input type={type} className={inputClassName()} />
      )}
    </td>
  );
}

function inputClassName() {
  return 'w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black/35';
}
