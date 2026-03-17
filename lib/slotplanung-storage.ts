import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  computeManagementSummary,
  enforceStaticSoll,
  type ManagementSummaryData,
} from '@/lib/management-summary';
import type { SlotplanungData, SlotplanungRow } from '@/lib/slotplanung';

const SLOTPLANUNG_PATH = path.join(process.cwd(), 'public', 'slotplanung_unikate.json');
const SUMMARY_PATH = path.join(process.cwd(), 'data', 'management_summary_unikate.json');

export async function readSlotplanungData(): Promise<SlotplanungData> {
  const raw = await readFile(SLOTPLANUNG_PATH, 'utf8');
  return JSON.parse(raw) as SlotplanungData;
}

export async function writeSlotplanungRows(rows: SlotplanungRow[]): Promise<SlotplanungData> {
  const current = await readSlotplanungData();
  const next: SlotplanungData = {
    ...current,
    rows,
  };

  await writeFile(SLOTPLANUNG_PATH, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

export async function readSummaryData(): Promise<ManagementSummaryData | null> {
  try {
    const raw = await readFile(SUMMARY_PATH, 'utf8');
    return enforceStaticSoll(JSON.parse(raw) as ManagementSummaryData);
  } catch {
    return null;
  }
}

export async function refreshAndPersistSummary(): Promise<ManagementSummaryData> {
  const slotplanung = await readSlotplanungData();
  const summary = enforceStaticSoll(computeManagementSummary(slotplanung));

  await mkdir(path.dirname(SUMMARY_PATH), { recursive: true });
  await writeFile(SUMMARY_PATH, JSON.stringify(summary, null, 2), 'utf8');

  return summary;
}
