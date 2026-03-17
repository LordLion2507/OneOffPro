import type { CSSProperties } from 'react';
import type { SlotplanungColumn, SlotplanungRow } from '@/lib/slotplanung';

type SlotplanungTableProps = {
  columns: SlotplanungColumn[];
  rows: SlotplanungRow[];
  zoomScale: number;
  onCellChange: (rowIndex: number, columnKey: string, value: string) => void;
};

const WIDTHS: Record<string, number> = {
  slot_id: 180,
  kunde: 220,
  fahrzeug: 260,
};

const STICKY_LEFT: Record<string, number> = {
  slot_id: 0,
  kunde: 180,
  fahrzeug: 400,
};

function formatLabel(label: string) {
  return label.replace(/\n/g, ' ');
}

function getColumnWidth(key: string) {
  return WIDTHS[key] ?? 150;
}

function isStickyColumn(key: string) {
  return key === 'slot_id' || key === 'kunde' || key === 'fahrzeug';
}

function getStickyStyle(key: string): CSSProperties {
  return {
    left: `${STICKY_LEFT[key]}px`,
  };
}

function isYearColumn(key: string) {
  return /^y\d{4}$/.test(key);
}

function getYearFromColumn(key: string) {
  const match = key.match(/^y(\d{4})$/);
  return match ? Number(match[1]) : null;
}

function isNumericValue(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }

    return Number.isFinite(Number(trimmed));
  }

  return false;
}

function getAlternatingPlanungsjahrColor(planungsjahr: number | null) {
  if (planungsjahr == null || planungsjahr < 2025) {
    return '#ffffff';
  }

  return (planungsjahr - 2025) % 2 === 0 ? '#e97132' : '#ffff00';
}

function getSpecialCaseColor(rowIndex: number, columnKey: string) {
  if (rowIndex === 0 || rowIndex === 1) {
    if (columnKey === 'y2025' || columnKey === 'y2026') {
      return '#e97132';
    }
  }

  if (rowIndex === 2 && columnKey === 'y2026') {
    return '#e97132';
  }

  if (rowIndex === 4 && (columnKey === 'y2025' || columnKey === 'y2026' || columnKey === 'y2027')) {
    return '#ffff00';
  }

  return null;
}

function getHighlightColor(
  rowIndex: number,
  columnKey: string,
  value: string | number | null | undefined,
  planungsjahr: number | null
) {
  if (!isYearColumn(columnKey)) {
    return '#ffffff';
  }

  const columnYear = getYearFromColumn(columnKey);
  if (columnYear == null || columnYear < 2025) {
    return '#ffffff';
  }

  if (!isNumericValue(value)) {
    return '#ffffff';
  }

  const specialCaseColor = getSpecialCaseColor(rowIndex, columnKey);
  if (specialCaseColor) {
    return specialCaseColor;
  }

  return getAlternatingPlanungsjahrColor(planungsjahr);
}

export default function SlotplanungTable({ columns, rows, zoomScale, onCellChange }: SlotplanungTableProps) {
  const planungsjahrByRow = rows.reduce<{ current: number | null; values: Array<number | null> }>(
    (accumulator, row) => {
      const slotId = String(row.slot_id ?? '').trim();
      const match = slotId.match(/^Planungsjahr\s+(\d{4})$/i);

      if (match) {
        const nextYear = Number(match[1]);
        return {
          current: nextYear,
          values: [...accumulator.values, null],
        };
      }

      return {
        current: accumulator.current,
        values: [...accumulator.values, accumulator.current],
      };
    },
    { current: null, values: [] }
  ).values;

  return (
    <div
      data-slotplanung-scroll-container="true"
      className="max-h-[72vh] overflow-auto rounded-xl border border-black/20 bg-white"
    >
      <div data-slotplanung-zoom-container="true" style={{ zoom: zoomScale } as CSSProperties}>
        <table className="min-w-[1900px] border-collapse text-left text-sm text-black">
          <thead>
            <tr className="bg-black text-white">
              {columns.map((column) => {
                const sticky = isStickyColumn(column.key);
                return (
                  <th
                    key={column.key}
                    className={`relative overflow-hidden border-b border-black bg-black px-3 py-2 font-semibold ${
                      sticky ? 'sticky z-50 border-r border-black' : 'sticky z-30'
                    } ${column.key === 'fahrzeug' ? 'shadow-[10px_0_12px_-10px_rgba(0,0,0,0.6)]' : ''}`}
                    style={{
                      width: `${getColumnWidth(column.key)}px`,
                      minWidth: `${getColumnWidth(column.key)}px`,
                      top: 0,
                      ...(sticky ? getStickyStyle(column.key) : {}),
                    }}
                  >
                    {formatLabel(column.label)}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => {
              return (
                <tr key={`slot-row-${rowIndex}`} className="group border-t border-neutral-200 hover:bg-neutral-100/60">
                {columns.map((column) => {
                  const value = row[column.key];
                  const sticky = isStickyColumn(column.key);
                  const highlightColor = getHighlightColor(
                    rowIndex,
                    column.key,
                    value,
                    planungsjahrByRow[rowIndex]
                  );

                  return (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`relative overflow-hidden px-2 py-2 align-top ${
                        sticky ? 'sticky z-20 border-r border-neutral-200 bg-white group-hover:bg-neutral-100/60' : ''
                      } ${column.key === 'fahrzeug' ? 'shadow-[10px_0_12px_-10px_rgba(0,0,0,0.45)]' : ''}`}
                      style={{
                        width: `${getColumnWidth(column.key)}px`,
                        minWidth: `${getColumnWidth(column.key)}px`,
                        ...(sticky ? getStickyStyle(column.key) : {}),
                      }}
                    >
                      <input
                        value={value == null ? '' : String(value)}
                        onChange={(event) => onCellChange(rowIndex, column.key, event.target.value)}
                        style={{ backgroundColor: highlightColor }}
                        className="w-full rounded-md border border-black/10 px-2 py-1 text-sm text-black outline-none focus:border-black/40"
                      />
                    </td>
                  );
                })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
