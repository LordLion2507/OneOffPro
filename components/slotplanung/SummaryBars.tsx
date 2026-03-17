import { HARDNESS_COLORS, type Hardness } from '@/lib/slotplanung';
import type { ManagementSummaryData, YearBlockEntry } from '@/lib/management-summary';

type SummaryBarsProps = {
  years: number[];
  blocksByYear: ManagementSummaryData['blocksByYear'];
  sollByYear: ManagementSummaryData['sollByYear'];
};

const ORDER: Hardness[] = ['HG3', 'HG2', 'HG1', 'HG0', 'FREI'];
const BASE_CHART_HEIGHT = 224;
const SLOT_HEIGHT = 32;
const SLOT_GAP = 8;

function countSlots(entries: YearBlockEntry[]) {
  return entries.length;
}

function getBarHeight(slotCount: number) {
  if (slotCount <= 0) {
    return 0;
  }

  return slotCount * SLOT_HEIGHT + (slotCount - 1) * SLOT_GAP;
}

function getSollLineBottom(sollCount: number) {
  if (sollCount <= 0) {
    return 0;
  }

  // Center the target marker in the gap between slot N and slot N+1.
  return sollCount * SLOT_HEIGHT + (sollCount - 0.5) * SLOT_GAP;
}

export default function SummaryBars({ years, blocksByYear, sollByYear }: SummaryBarsProps) {
  const slotCountPerYear = Object.fromEntries(
    years.map((year) => [year, countSlots(blocksByYear[year] ?? [])])
  ) as Record<number, number>;
  const maxSlotCount = Math.max(...years.map((year) => slotCountPerYear[year] ?? 0), 1);
  const chartHeight = Math.max(BASE_CHART_HEIGHT, getBarHeight(maxSlotCount));

  return (
    <div className="rounded-xl border border-black/20 bg-white p-4">
      <h3 className="text-sm font-semibold text-black">Slot-Balken nach Jahren</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {years.map((year) => {
          const entries = [...(blocksByYear[year] ?? [])].sort(
            (a, b) => ORDER.indexOf(a.hardness) - ORDER.indexOf(b.hardness)
          );
          const totalSlots = slotCountPerYear[year] ?? 0;
          const soll = sollByYear[year] ?? 0;
          const barHeightPx = getBarHeight(totalSlots);
          const sollBoundaryBottomPx = Math.min(chartHeight, getSollLineBottom(soll));

          return (
            <div key={year} className="rounded-lg border border-black/10 bg-neutral-50 p-2">
              <div
                className="relative rounded-md border border-black/10 bg-white"
                style={{ height: `${chartHeight}px` }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 z-30 border-t-[3px] border-green-600"
                  style={{ bottom: `${sollBoundaryBottomPx}px` }}
                />

                <div
                  className="absolute inset-x-1 bottom-0 z-10 flex flex-col-reverse justify-end gap-2 overflow-hidden"
                  style={{ height: `${Math.max(0, barHeightPx)}px` }}
                >
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded px-1 py-1 text-[10px] leading-tight text-black"
                      style={{
                        backgroundColor: HARDNESS_COLORS[entry.hardness],
                        border: '1px solid rgba(0,0,0,0.25)',
                        minHeight: `${SLOT_HEIGHT}px`,
                        height: `${SLOT_HEIGHT}px`,
                      }}
                      title={entry.label}
                    >
                      {entry.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-center text-xs font-semibold text-black">{year}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
