export type SlotplanungColumn = {
  label: string;
  key: string;
  nullable?: boolean;
};

export type SlotplanungRow = Record<string, string | number | null>;

export type SlotplanungData = {
  sheet: string;
  table: string;
  range: string;
  columns: SlotplanungColumn[];
  rows: SlotplanungRow[];
};

export type Hardness = 'HG0' | 'HG1' | 'HG2' | 'HG3' | 'FREI';

export const HARDNESS_ORDER: Hardness[] = ['HG3', 'HG2', 'HG1', 'HG0', 'FREI'];

export const HARDNESS_COLORS: Record<Hardness, string> = {
  HG0: '#bdbdbd',
  HG1: '#9c9c9c',
  HG2: '#ffff00',
  HG3: '#5ED925',
  FREI: '#ffffff',
};

export function toNumber(value: string | number | null | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function getYearColumns(columns: SlotplanungColumn[]): { key: string; year: number }[] {
  return columns
    .map((column) => {
      const match = column.key.match(/^y(\d{4})$/);
      if (!match) {
        return null;
      }

      return {
        key: column.key,
        year: Number(match[1]),
      };
    })
    .filter((value): value is { key: string; year: number } => value !== null)
    .sort((a, b) => a.year - b.year);
}

export function determineHardness(row: SlotplanungRow): Hardness {
  if (toNumber(row.umsetzung_hg3) > 0) {
    return 'HG3';
  }

  if (toNumber(row.konzept_hg2) > 0) {
    return 'HG2';
  }

  if (toNumber(row.pre_alignment_hg1) > 0) {
    return 'HG1';
  }

  if (toNumber(row.aquise_hg0) > 0) {
    return 'HG0';
  }

  return 'HG0';
}

export function isFreeSlot(row: SlotplanungRow): boolean {
  const kunde = String(row.kunde ?? '').trim();
  const fahrzeug = String(row.fahrzeug ?? '').trim();
  return kunde.length === 0 && fahrzeug.length === 0;
}
