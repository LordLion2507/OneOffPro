import type { ManagementSummaryData } from '@/lib/management-summary';

type SummaryBusinessTableProps = {
  years: number[];
  rows: ManagementSummaryData['businessCaseRows'];
};

export default function SummaryBusinessTable({ years, rows }: SummaryBusinessTableProps) {
  return (
    <div className="rounded-xl border border-black/20 bg-white p-4">
      <h3 className="text-sm font-semibold text-black">BUSINESS CASE - AUSLIEFERUNG FAHRZEUGE</h3>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-xs text-black">
          <thead>
            <tr className="bg-black text-white">
              <th className="px-3 py-2 font-semibold">Position</th>
              {years.map((year) => (
                <th key={year} className="px-3 py-2 text-center font-semibold">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-neutral-200 bg-white hover:bg-neutral-100">
                <td className="px-3 py-2 font-medium">{row.label}</td>
                {years.map((year) => (
                  <td key={`${row.label}-${year}`} className="px-3 py-2 text-center">
                    {row.values[year] ?? 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-1 text-[11px] text-black/75 sm:grid-cols-2 lg:grid-cols-4">
        <p>HG0 = AKQUISE</p>
        <p>HG1 = PRE-ALIGNMENT</p>
        <p>HG2 = KONZEPTPHASE</p>
        <p>HG3 = UMSETZUNGSPHASE/AUSLIEFERUNG</p>
      </div>
    </div>
  );
}
