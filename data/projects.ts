export type Project = {
  projectId: string;
  kunde: string;
  werksunikat: string;
  projektleiter: string;
  produktentwickler: string;
  kundenberater: string;
};

export const projects: Project[] = [
  {
    projectId: 'OC1',
    kunde: 'Luca Trazzi',
    werksunikat: '911 Speedster (993)',
    projektleiter: 'NB',
    produktentwickler: 'RP',
    kundenberater: 'PS',
  },
  {
    projectId: 'OC2',
    kunde: 'Vincent Lin',
    werksunikat: '911 Speedster (996.2)',
    projektleiter: 'NB',
    produktentwickler: 'AL',
    kundenberater: 'MR',
  },
  {
    projectId: 'OC3',
    kunde: 'Phillip Sarofim',
    werksunikat: '914/6 Tapiro (914/6)',
    projektleiter: 'NB',
    produktentwickler: 'CZ',
    kundenberater: 'AC',
  },
  {
    projectId: 'OC4',
    kunde: 'Bob Linton',
    werksunikat: '911 R (991.2) Rückleuchte',
    projektleiter: 'MA',
    produktentwickler: 'JL',
    kundenberater: 'GL',
  },
  {
    projectId: 'OC5',
    kunde: 'Paolo Barilla',
    werksunikat: '911 GT3 (992.1)',
    projektleiter: 'NB',
    produktentwickler: 'RP',
    kundenberater: 'PS',
  },
];
