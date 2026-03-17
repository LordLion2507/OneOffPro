export type CustomerFormData = {
  kundenId: string;
  anrede: string;
  vorname: string;
  nachname: string;
  geburtstag: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
  telefon: string;
  email: string;
  kommunikationssprache: string;
  interesseOneOff: boolean;
  interesseReCommissioning: boolean;
  markt: string;
  berater: string;
  ansprechpartner: string;
  ansprechpartnerTel: string;
  ansprechpartnerMail: string;
  bemerkung: string;
  anlagedatum: string;
  prioritaet: string;
  letzterPepCheck: string;
  infofeld: string;
};

export type CustomerProjectItem = {
  id: string;
  projektId: string;
  type: string;
  projektName: string;
  status: string;
  vehicleTitle: string;
};

export const emptyCustomer: CustomerFormData = {
  kundenId: '',
  anrede: '',
  vorname: '',
  nachname: '',
  geburtstag: '',
  strasse: '',
  plz: '',
  ort: '',
  land: '',
  telefon: '',
  email: '',
  kommunikationssprache: '',
  interesseOneOff: false,
  interesseReCommissioning: false,
  markt: '',
  berater: '',
  ansprechpartner: '',
  ansprechpartnerTel: '',
  ansprechpartnerMail: '',
  bemerkung: '',
  anlagedatum: '',
  prioritaet: '',
  letzterPepCheck: '',
  infofeld: '',
};

export const lucaTrazziData: CustomerFormData = {
  kundenId: 'K-1001',
  anrede: 'Herr',
  vorname: 'Luca',
  nachname: 'Trazzi',
  geburtstag: '1986-05-17',
  strasse: 'Via Roma 18',
  plz: '20121',
  ort: 'Milano',
  land: 'Italy',
  telefon: '+39 02 123456',
  email: 'luca.trazzi@example.com',
  kommunikationssprache: 'Italienisch',
  interesseOneOff: true,
  interesseReCommissioning: true,
  markt: 'Italy',
  berater: 'PS',
  ansprechpartner: 'Marco R.',
  ansprechpartnerTel: '+39 02 987654',
  ansprechpartnerMail: 'marco.r@example.com',
  bemerkung: 'VIP Kunde mit hoher Individualisierungstiefe.',
  anlagedatum: '2026-02-20',
  prioritaet: 'Hoch',
  letzterPepCheck: '2026-03-01',
  infofeld:
    'Aktiver Fokus: 993 Speedster (OC1). Zusätzliche Optionen für Exterieurteile und Interieur-Finishes in Klärung.',
};

export const projectItems: CustomerProjectItem[] = [
  {
    id: 'p1',
    projektId: 'ALLGEMEIN',
    type: 'Allgemein',
    projektName: 'Allgemein',
    status: 'Interesse (Lead)',
    vehicleTitle: 'Allgemein',
  },
  {
    id: 'p2',
    projektId: 'GC992',
    type: 'One-Off',
    projektName: '992 Speedster (Group Creation)',
    status: 'Interesse (Lead)',
    vehicleTitle: '992 Speedster (Group Creation)',
  },
  {
    id: 'p3',
    projektId: 'OC996T',
    type: 'One-Off',
    projektName: '996 Speedster Turbo',
    status: 'Interesse (Lead)',
    vehicleTitle: '996 Speedster Turbo',
  },
  {
    id: 'p4',
    projektId: 'OC1',
    type: 'One-Off',
    projektName: '993 Speedster (OC1)',
    status: 'Umsetzungsphase',
    vehicleTitle: '911 Speedster (993)',
  },
  {
    id: 'p5',
    projektId: 'RC992II',
    type: 'Re-Commissioning',
    projektName: '911 GT3 RS MR (992 II)',
    status: 'Absage',
    vehicleTitle: '911 GT3 RS MR (992 II)',
  },
];

export function getCustomerProjectById(projektId: string) {
  return projectItems.find((item) => item.projektId === projektId) ?? null;
}

export const activityItems = [
  { id: 'a1', datum: '02.03.2026', uhrzeit: '14:41:41', typ: 'Datenänderung', betreff: 'Projekt aktualisiert' },
  { id: 'a2', datum: '02.03.2026', uhrzeit: '14:39:12', typ: 'Datenänderung', betreff: 'Projekt aktualisiert' },
  { id: 'a3', datum: '02.03.2026', uhrzeit: '14:33:44', typ: 'Datenänderung', betreff: 'Projekt aktualisiert' },
  { id: 'a4', datum: '26.02.2026', uhrzeit: '13:40:57', typ: 'E-Mail', betreff: 'Absage KVA' },
];
