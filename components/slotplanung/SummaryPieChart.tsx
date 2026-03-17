import type { ManagementSummaryData } from '@/lib/management-summary';

type SummaryPieChartProps = {
  phaseCounts: ManagementSummaryData['phaseCounts'];
};

const COLORS = {
  HG0: '#bdbdbd',
  HG1: '#9c9c9c',
  HG2: '#ffff00',
  HG3: '#5ED925',
};

export default function SummaryPieChart({ phaseCounts }: SummaryPieChartProps) {
  const total = phaseCounts.HG0 + phaseCounts.HG1 + phaseCounts.HG2 + phaseCounts.HG3;

  const segments = [
    { key: 'HG0', value: phaseCounts.HG0, color: COLORS.HG0 },
    { key: 'HG1', value: phaseCounts.HG1, color: COLORS.HG1 },
    { key: 'HG2', value: phaseCounts.HG2, color: COLORS.HG2 },
    { key: 'HG3', value: phaseCounts.HG3, color: COLORS.HG3 },
  ] as const;

  let start = 0;
  const gradient = segments
    .map((segment) => {
      const ratio = total > 0 ? segment.value / total : 0;
      const end = start + ratio * 360;
      const part = `${segment.color} ${start.toFixed(2)}deg ${end.toFixed(2)}deg`;
      start = end;
      return part;
    })
    .join(', ');

  return (
    <div className="rounded-xl border border-black/20 bg-white p-4">
      <h3 className="text-sm font-semibold text-black">Work in Progress</h3>
      <div className="mt-3 flex flex-col items-center justify-center">
        <div
          className="h-52 w-52 rounded-full border border-black/20 sm:h-60 sm:w-60"
          style={{ background: `conic-gradient(${gradient || '#e5e5e5 0deg 360deg'})` }}
        />
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-black">
          {segments.map((segment) => (
            <div key={segment.key} className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm border border-black/20"
                style={{ backgroundColor: segment.color }}
              />
              <span className="font-medium">{segment.key}</span>
              <span>{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
