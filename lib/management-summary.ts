import {
  determineHardness,
  getYearColumns,
  HARDNESS_ORDER,
  isFreeSlot,
  toNumber,
  type Hardness,
  type SlotplanungData,
} from '@/lib/slotplanung';

export type YearBlockEntry = {
  id: string;
  customer: string;
  qty: number;
  hardness: Hardness;
  label: string;
};

export type BusinessCaseRow = {
  label: string;
  values: Record<number, number>;
};

export type ManagementSummaryData = {
  years: number[];
  phaseCounts: Record<'HG0' | 'HG1' | 'HG2' | 'HG3', number>;
  blocksByYear: Record<number, YearBlockEntry[]>;
  sollByYear: Record<number, number>;
  businessCaseRows: BusinessCaseRow[];
  generatedAt: string;
};

const DEFAULT_YEARS = [2026, 2027, 2028, 2029, 2030, 2031];

export const STATIC_SOLL: Record<number, number> = {
  2026: 2,
  2027: 1,
  2028: 6,
  2029: 7,
  2030: 9,
  2031: 9,
};

export function enforceStaticSoll(summary: ManagementSummaryData): ManagementSummaryData {
  const nextSoll = Object.fromEntries(
    summary.years.map((year) => [year, STATIC_SOLL[year] ?? 0])
  ) as Record<number, number>;

  const businessCaseRows = summary.businessCaseRows.map((row) => {
    if (row.label !== 'SOLL AUSLIEFERUNGEN') {
      return row;
    }

    return {
      ...row,
      values: nextSoll,
    };
  });

  return {
    ...summary,
    sollByYear: nextSoll,
    businessCaseRows,
  };
}

export function computeManagementSummary(data: SlotplanungData): ManagementSummaryData {
  const yearColumns = getYearColumns(data.columns).filter((column) => DEFAULT_YEARS.includes(column.year));
  const years = yearColumns.map((column) => column.year);

  const phaseCounts: Record<'HG0' | 'HG1' | 'HG2' | 'HG3', number> = {
    HG0: 0,
    HG1: 0,
    HG2: 0,
    HG3: 0,
  };

  const blocksByYear: Record<number, YearBlockEntry[]> = {};
  const planSumByYear: Record<number, number> = {};
  const byHardnessByYear: Record<'HG0' | 'HG1' | 'HG2' | 'HG3', Record<number, number>> = {
    HG0: {},
    HG1: {},
    HG2: {},
    HG3: {},
  };

  for (const year of years) {
    blocksByYear[year] = [];
    planSumByYear[year] = 0;
    byHardnessByYear.HG0[year] = 0;
    byHardnessByYear.HG1[year] = 0;
    byHardnessByYear.HG2[year] = 0;
    byHardnessByYear.HG3[year] = 0;
  }

  data.rows.forEach((row, rowIndex) => {
    const rawHardness = determineHardness(row);
    const customer = String(row.kunde ?? '').trim();
    const customerIsFree = customer.toLowerCase() === 'frei';
    const free = isFreeSlot(row) || customerIsFree;
    const hardness: Hardness = free ? 'FREI' : rawHardness;

    yearColumns.forEach(({ key, year }) => {
      const qty = toNumber(row[key]);
      if (qty <= 0) {
        return;
      }

      const label = free ? 'frei' : `${customer || 'Unbekannt'} | ${qty} | ${hardness}`;

      blocksByYear[year].push({
        id: `${year}-${rowIndex}-${key}`,
        customer: customer || 'frei',
        qty,
        hardness,
        label,
      });

      if (!free && rawHardness !== 'FREI') {
        phaseCounts[rawHardness] += 1;
        planSumByYear[year] += qty;
        byHardnessByYear[rawHardness][year] += qty;
      }
    });
  });

  for (const year of years) {
    blocksByYear[year].sort((a, b) => {
      const orderA = HARDNESS_ORDER.indexOf(a.hardness);
      const orderB = HARDNESS_ORDER.indexOf(b.hardness);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return a.customer.localeCompare(b.customer);
    });
  }

  const businessCaseRows: BusinessCaseRow[] = [
    {
      label: 'SOLL AUSLIEFERUNGEN',
      values: Object.fromEntries(years.map((year) => [year, STATIC_SOLL[year] ?? 0])),
    },
    {
      label: 'PLAN SUMME HG0 - HG3',
      values: Object.fromEntries(years.map((year) => [year, planSumByYear[year] ?? 0])),
    },
    {
      label: 'UMSETZUNGSPHASE (HG3)',
      values: Object.fromEntries(years.map((year) => [year, byHardnessByYear.HG3[year] ?? 0])),
    },
    {
      label: 'KONZEPTPHASE (HG2)',
      values: Object.fromEntries(years.map((year) => [year, byHardnessByYear.HG2[year] ?? 0])),
    },
    {
      label: 'PRE-ALIGNMENT (HG1)',
      values: Object.fromEntries(years.map((year) => [year, byHardnessByYear.HG1[year] ?? 0])),
    },
    {
      label: 'Akquise (HG0)',
      values: Object.fromEntries(years.map((year) => [year, byHardnessByYear.HG0[year] ?? 0])),
    },
  ];

  return {
    years,
    phaseCounts,
    blocksByYear,
    sollByYear: Object.fromEntries(years.map((year) => [year, STATIC_SOLL[year] ?? 0])),
    businessCaseRows,
    generatedAt: new Date().toISOString(),
  };
}
