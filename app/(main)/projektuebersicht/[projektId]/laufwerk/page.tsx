'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

type FolderNode = {
  id: string;
  name: string;
  children?: FolderNode[];
};

const FOLDER_TREE: FolderNode[] = [
  {
    id: '0-projektmanagement',
    name: '0 - Projektmanagement',
    children: [
      {
        id: '0-10-terminplaene',
        name: '10 - Terminpläne',
        children: [
          { id: '0-10-1', name: '1 - Einzelterminpläne' },
          { id: '0-10-2', name: '2 - Gesamtprojektterminplan' },
          { id: '0-10-3', name: '3 - Kundenterminplan' },
        ],
      },
      {
        id: '0-20-projektuebersicht',
        name: '20 - Projektübersicht',
        children: [
          { id: '0-20-license-agreement', name: 'License Agreement' },
          { id: '0-20-uebersicht-allgemein', name: 'Übersicht Allgemein' },
          { id: '0-20-zuordnung-pe', name: 'Zuordnung PE' },
        ],
      },
      {
        id: '0-30-projektkosten',
        name: '30 - Projektkosten',
        children: [
          { id: '0-30-01', name: '01 - Anfrage' },
          { id: '0-30-02', name: '02 - Angebote' },
          { id: '0-30-03', name: '03 - Kostenübersicht und Kalkulation' },
          { id: '0-30-04', name: '04 - BANF_Bestellung_Abrechnung' },
          { id: '0-30-05', name: '05 - Modalitäten Steuern' },
        ],
      },
      { id: '0-40-projekttracking', name: '40 - Projekttracking' },
      { id: '0-50-einlagerung-teile', name: '50 - Einlagerung Teile' },
    ],
  },
  {
    id: '1-vertrag',
    name: '1 - Vertrag',
    children: [
      { id: '1-01-konzeptphase', name: '01 - Konzeptphase' },
      { id: '1-02-umsetzungsphase', name: '02 - Umsetzungsphase' },
      { id: '1-03-lizenzvertraege', name: '03 - Lizenzverträge_Nutzungsverträge' },
      { id: '1-04-geheimhaltung', name: '04 - Geheimhaltungsvereinbarung' },
      { id: '1-05-fahrzeuguebergabe', name: '05 - Fahrzeugübergabeprotokoll' },
    ],
  },
  { id: '2-kundeninformation', name: '2 - Kundeninformation' },
  {
    id: '3-schriftverkehr',
    name: '3 - Schriftverkehr',
    children: [
      { id: '3-1-intern', name: '1 - Intern' },
      { id: '3-2-extern', name: '2 - Extern' },
    ],
  },
  {
    id: '4-basisfahrzeug',
    name: '4 - Basisfahrzeug',
    children: [
      { id: '4-1-bilder', name: '1 - Bilder' },
      { id: '4-2-ausstattungsliste', name: '2 - Ausstattungsliste' },
      { id: '4-3-fahrzeuganlieferung', name: '3 - Fahrzeuganlieferung' },
      { id: '4-4-fahrzeugzulassung', name: '4 - Fahrzeugzulassung' },
      { id: '4-5-fahrzeuginfos', name: '5 - Fahrzeuginfos' },
    ],
  },
  {
    id: '5-vision-lastenheft',
    name: '5 - Vision, Lastenheft',
    children: [
      { id: '5-0-fotos', name: '0 - Fotos u. Inspirationen' },
      { id: '5-1-steckbrief', name: '1 - Steckbrief' },
      { id: '5-2-visualisierung', name: '2 - Visualisierung' },
      { id: '5-3-lastenheft', name: '3 - Lastenheft' },
    ],
  },
  {
    id: '6-workshops',
    name: '6 - Workshops',
    children: [
      { id: '6-1-intern', name: '1 - Intern' },
      { id: '6-2-extern', name: '2 - Extern' },
    ],
  },
  {
    id: '7-entwicklung-technik',
    name: '7 - Entwicklung Technik',
    children: [
      { id: '7-00', name: '00 - Allgemein_Gesamtfahrzeug' },
      { id: '7-01', name: '01 - CAD_Daten_Konstruktion' },
      { id: '7-02', name: '02 - Zulassung_Gesetze_Typisierung_Normen' },
      { id: '7-03', name: '03 - Aerodynamik' },
      { id: '7-04', name: '04 - Fahrzeugsicherheit' },
      { id: '7-05', name: '05 - Leichtbau' },
      { id: '7-06', name: '06 - Stückliste' },
      { id: '7-07', name: '07 - Elektrik u Elektronik' },
      { id: '7-08', name: '08 - Lackierung' },
      { id: '7-09', name: '09 - Erprobung u Versuch' },
      { id: '7-10', name: '10 - A' },
      { id: '7-20', name: '20 - B' },
      { id: '7-30', name: '30 - C' },
      { id: '7-40', name: '40 - D' },
      { id: '7-50', name: '50 - E' },
      { id: '7-60', name: '60 - F' },
      { id: '7-70', name: '70 - G' },
      { id: '7-80', name: '80 - H' },
      { id: '7-90', name: '90 - I' },
      { id: '7-100', name: '100 - J' },
    ],
  },
  {
    id: '8-qualitaet',
    name: '8 - Qualität',
    children: [
      { id: '8-1-zeichnungen', name: '1 - Zeichnungen' },
      { id: '8-2-pruefzeugnisse', name: '2 - Prüfzeugnisse' },
    ],
  },
  {
    id: '9-kommunikation',
    name: '9 - Kommunikation',
    children: [
      { id: '9-1-intern', name: '1 - Intern' },
      { id: '9-2-extern', name: '2 - Extern' },
      { id: '9-3-kunde', name: '3 - Kunde' },
      { id: '9-4-shootings', name: '4 - Orga Shootings' },
      { id: '9-5-medien', name: '5 - Medien' },
    ],
  },
  { id: 'archiv', name: 'Archiv' },
];

const COLUMNS = [
  'Name',
  'Geändert',
  'Geändert von',
  'KSU Klasse',
  'Löschdatum',
  'Ereignisdatum',
] as const;

const DEFAULT_OPEN_FOLDERS = [
  '0-projektmanagement',
  '0-10-terminplaene',
  '0-20-projektuebersicht',
  '0-30-projektkosten',
];

export default function ProjectLaufwerkPage() {
  const params = useParams<{ projektId: string }>();
  const projektId = useMemo(() => {
    const raw = params?.projektId;
    return typeof raw === 'string' && raw.length > 0 ? decodeURIComponent(raw) : 'OCx';
  }, [params]);
  const [openFolders, setOpenFolders] = useState<string[]>(DEFAULT_OPEN_FOLDERS);

  const toggleFolder = (folderId: string) => {
    setOpenFolders((current) =>
      current.includes(folderId)
        ? current.filter((item) => item !== folderId)
        : [...current, folderId]
    );
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Laufwerk - {projektId}</h1>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/20 bg-white/90 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-[minmax(420px,2.3fr)_1fr_1fr_1fr_1fr_1fr] border-b border-black/10 bg-black text-sm font-semibold text-white">
          {COLUMNS.map((column) => (
            <div key={column} className="flex items-center gap-2 px-4 py-3">
              <span>{column}</span>
              <span className="text-[10px] text-white/55">▼</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[minmax(420px,2.3fr)_1fr_1fr_1fr_1fr_1fr] border-b border-white/10 bg-black text-sm text-white">
          {COLUMNS.map((column, index) => (
            <div
              key={`${column}-filter`}
              className={`px-4 py-2 ${index === 0 ? 'text-white/75' : 'text-white/35'}`}
            >
              {index === 0 ? 'Filter festlegen ...' : '-'}
            </div>
          ))}
        </div>

        <div className="divide-y divide-neutral-200/80">
          {FOLDER_TREE.map((node) => (
            <FolderRow
              key={node.id}
              node={node}
              depth={0}
              openFolders={openFolders}
              onToggle={toggleFolder}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FolderRow({
  node,
  depth,
  openFolders,
  onToggle,
}: {
  node: FolderNode;
  depth: number;
  openFolders: string[];
  onToggle: (folderId: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = hasChildren && openFolders.includes(node.id);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            onToggle(node.id);
          }
        }}
        className="grid w-full grid-cols-[minmax(420px,2.3fr)_1fr_1fr_1fr_1fr_1fr] text-left transition hover:bg-neutral-100/80"
      >
        <div
          className="flex items-center gap-3 px-4 py-3 text-sm text-black"
          style={{ paddingLeft: `${16 + depth * 28}px` }}
        >
          <span className="w-4 text-xs text-black/70">{hasChildren ? (isOpen ? '▼' : '▶') : ''}</span>
          <span className="relative inline-block h-4 w-5 rounded-sm border border-black bg-black">
            <span className="absolute -top-1 left-0.5 h-1.5 w-2.5 rounded-t-sm border border-b-0 border-black bg-black" />
          </span>
          <span className="font-medium">{node.name}</span>
        </div>
        {COLUMNS.slice(1).map((column) => (
          <div key={`${node.id}-${column}`} className="px-4 py-3 text-sm text-black/45" />
        ))}
      </button>

      {isOpen
        ? node.children?.map((child) => (
            <FolderRow
              key={child.id}
              node={child}
              depth={depth + 1}
              openFolders={openFolders}
              onToggle={onToggle}
            />
          ))
        : null}
    </>
  );
}
