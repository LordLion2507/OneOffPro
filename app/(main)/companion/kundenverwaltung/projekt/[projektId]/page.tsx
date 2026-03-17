'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCustomerProjectById } from '@/data/companion';

type InvoiceState = {
  projekt: string;
  kundenIdShort: string;
  kundenName: string;
  typ: string;
  beraterId: string;
  rechnungsadresse: string;
  vin: string;
  kundenpreis: string;
  auftragsnummer: string;
  debitorenNr: string;
  steuerId: string;
  umbauOrt: string;
  fahrzeugAnlieferung: string;
  status: string;
  steckbriefErstellt: boolean;
  eigentumsnachweis: boolean;
  kopiePersonalnachweis: boolean;
  kvaErstellt: boolean;
  konzeptphaseAnzahlung: boolean;
};

const oc1InvoiceDefaults: InvoiceState = {
  projekt: '840190535',
  kundenIdShort: '15',
  kundenName: 'Luca Trazzi',
  typ: 'One-Off',
  beraterId: 'Leon Beispiel',
  rechnungsadresse: '',
  vin: '',
  kundenpreis: '',
  auftragsnummer: '',
  debitorenNr: '',
  steuerId: '',
  umbauOrt: '',
  fahrzeugAnlieferung: '',
  status: '',
  steckbriefErstellt: false,
  eigentumsnachweis: false,
  kopiePersonalnachweis: false,
  kvaErstellt: false,
  konzeptphaseAnzahlung: false,
};

type SteckbriefCard = {
  title: string;
  lines: string[];
};

const oc1SteckbriefCards: SteckbriefCard[] = [
  {
    title: 'Concept*',
    lines: ['One-Off Re-Commissioning', '993 Speedster Heritage Konzept', 'Fokus: Originalität + Straßenzulassung'],
  },
  {
    title: 'Technical Specs*',
    lines: ['Basis: 911 Speedster (993)', 'Fahrzeugklasse: Werksunikat', 'Plattformprüfung abgeschlossen'],
  },
  {
    title: 'Powertrain*',
    lines: ['Antrieb: Verbrenner', 'Leistungsziel: Seriennah', 'Getriebeabgleich in Prüfung'],
  },
  {
    title: 'Body Exterior*',
    lines: ['Lackierung: Sonderfarbe final offen', 'Exterieur-Paket: individualisiert', 'Anbauteile in Freigabe'],
  },
  {
    title: 'Body Interior*',
    lines: ['Lederkonzept: Bi-Color', 'Nähte: Kontrast abgestimmt', 'Interieur-Materialboard freigegeben'],
  },
  {
    title: 'Electric*',
    lines: ['Steuergeräte-Abgleich aktiv', 'Lichtfunktionen in Validierung', 'Diagnoseumfang abgestimmt'],
  },
  {
    title: 'Chassis*',
    lines: ['Fahrwerkssetup: Komfort/Sport', 'Bremspaket seriennah', 'Achsvermessung geplant'],
  },
  {
    title: 'Accessories*',
    lines: ['Kundenmappe individualisiert', 'Lieferumfang Sonderwunsch', 'Abnahme-Dokumentation vorbereitet'],
  },
];

function Field({
  label,
  children,
  fullWidth = false,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <label className={`space-y-1 ${fullWidth ? 'md:col-span-2' : ''}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-black/70">{label}</span>
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
}: {
  value: string;
  onChange: (nextValue: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black/40"
    />
  );
}

export default function CompanionProjektPage() {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : '';
  }, [params]);
  const project = useMemo(() => getCustomerProjectById(projektId), [projektId]);
  const [invoiceData, setInvoiceData] = useState<InvoiceState>(oc1InvoiceDefaults);

  if (!project) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">{projektId || 'Projekt'}</h1>
      </section>
    );
  }

  if (project.projektId !== 'OC1') {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">{project.vehicleTitle}</h1>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">911 Speedster (993)</h1>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-black">Steckbrief</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {oc1SteckbriefCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-black/20 bg-white/90 p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-base font-semibold text-black">{card.title}</h3>
              <ul className="mt-2 space-y-1 text-sm text-black/85">
                {card.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-black">Rechnung</h2>
        <div className="mt-4 rounded-2xl border border-black/20 bg-white/90 p-5 shadow-[0_10px_22px_rgba(0,0,0,0.1)]">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Projekt">
              <Input value={invoiceData.projekt} onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, projekt: nextValue }))} />
            </Field>

            <Field label="Typ">
              <Input value={invoiceData.typ} onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, typ: nextValue }))} />
            </Field>

            <Field label="KundenID">
              <div className="grid grid-cols-[90px_1fr] gap-2">
                <Input
                  value={invoiceData.kundenIdShort}
                  onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, kundenIdShort: nextValue }))}
                />
                <Input
                  value={invoiceData.kundenName}
                  onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, kundenName: nextValue }))}
                />
              </div>
            </Field>

            <Field label="BeraterID">
              <Input value={invoiceData.beraterId} onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, beraterId: nextValue }))} />
            </Field>

            <Field label="Rechnungsadresse" fullWidth>
              <textarea
                value={invoiceData.rechnungsadresse}
                onChange={(event) => setInvoiceData((prev) => ({ ...prev, rechnungsadresse: event.target.value }))}
                className="min-h-24 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black/40"
              />
            </Field>

            <Field label="VIN">
              <Input value={invoiceData.vin} onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, vin: nextValue }))} />
            </Field>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href="/projektuebersicht/cockpit/OC1"
                className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Projektübersicht
              </Link>
              <Link
                href="/projektuebersicht/OC1/kalkulation"
                className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Kalkulation
              </Link>
            </div>

            <Field label="Kundenpreis">
              <Input
                value={invoiceData.kundenpreis}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, kundenpreis: nextValue }))}
              />
            </Field>
            <Field label="Auftragsnummer">
              <Input
                value={invoiceData.auftragsnummer}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, auftragsnummer: nextValue }))}
              />
            </Field>
            <Field label="DebitorenNr">
              <Input
                value={invoiceData.debitorenNr}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, debitorenNr: nextValue }))}
              />
            </Field>
            <Field label="Steuer ID">
              <Input
                value={invoiceData.steuerId}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, steuerId: nextValue }))}
              />
            </Field>
            <Field label="Umbau Ort">
              <Input
                value={invoiceData.umbauOrt}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, umbauOrt: nextValue }))}
              />
            </Field>
            <Field label="Fahrzeug Anlieferung">
              <Input
                value={invoiceData.fahrzeugAnlieferung}
                onChange={(nextValue) => setInvoiceData((prev) => ({ ...prev, fahrzeugAnlieferung: nextValue }))}
              />
            </Field>

            <Field label="Status" fullWidth>
              <textarea
                value={invoiceData.status}
                onChange={(event) => setInvoiceData((prev) => ({ ...prev, status: event.target.value }))}
                className="min-h-24 w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black/40"
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 text-sm text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-none border border-black"
                checked={invoiceData.steckbriefErstellt}
                onChange={(event) =>
                  setInvoiceData((prev) => ({ ...prev, steckbriefErstellt: event.target.checked }))
                }
              />
              Steckbrief erstellt
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 text-sm text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-none border border-black"
                checked={invoiceData.eigentumsnachweis}
                onChange={(event) =>
                  setInvoiceData((prev) => ({ ...prev, eigentumsnachweis: event.target.checked }))
                }
              />
              Eigentumsnachweis
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 text-sm text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-none border border-black"
                checked={invoiceData.kopiePersonalnachweis}
                onChange={(event) =>
                  setInvoiceData((prev) => ({ ...prev, kopiePersonalnachweis: event.target.checked }))
                }
              />
              Kopie Personalnachweis
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 text-sm text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-none border border-black"
                checked={invoiceData.kvaErstellt}
                onChange={(event) => setInvoiceData((prev) => ({ ...prev, kvaErstellt: event.target.checked }))}
              />
              KVA Erstellt
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 text-sm text-black">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-none border border-black"
                checked={invoiceData.konzeptphaseAnzahlung}
                onChange={(event) =>
                  setInvoiceData((prev) => ({ ...prev, konzeptphaseAnzahlung: event.target.checked }))
                }
              />
              Konzeptphase Anzahlung
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
