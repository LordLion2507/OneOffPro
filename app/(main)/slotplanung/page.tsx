'use client';

import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import SummaryPieChart from '@/components/slotplanung/SummaryPieChart';
import SummaryBars from '@/components/slotplanung/SummaryBars';
import SummaryBusinessTable from '@/components/slotplanung/SummaryBusinessTable';
import SlotplanungTable from '@/components/slotplanung/SlotplanungTable';
import type { ManagementSummaryData } from '@/lib/management-summary';
import type { SlotplanungData, SlotplanungRow } from '@/lib/slotplanung';

const EXPORT_STYLE_PROPERTIES = [
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'box-sizing',
  'flex',
  'flex-direction',
  'justify-content',
  'align-items',
  'gap',
  'grid-template-columns',
  'grid-template-rows',
  'grid-column',
  'grid-row',
  'overflow',
  'overflow-x',
  'overflow-y',
  'white-space',
  'text-align',
  'font',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-transform',
  'text-decoration',
  'color',
  'background-color',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-radius',
  'outline',
  'outline-color',
  'box-shadow',
  'opacity',
  'visibility',
  'z-index',
  'transform',
  'transform-origin',
  'zoom',
  'vertical-align',
  'list-style',
  'object-fit',
] as const;

function sanitizeCssValue(property: string, value: string) {
  if (!value) {
    return '';
  }

  const normalized = value.trim();
  if (!normalized) {
    return '';
  }

  if (/\b(?:oklab|oklch|lab|lch|color-mix)\s*\(/i.test(normalized)) {
    if (
      property.includes('color') ||
      property === 'background-color' ||
      property.startsWith('border')
    ) {
      return property === 'color' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)';
    }

    if (property === 'box-shadow' || property === 'outline') {
      return 'none';
    }
  }

  return normalized;
}

function createSanitizedExportClone(sourceRoot: HTMLElement) {
  const clonedRoot = sourceRoot.cloneNode(true) as HTMLElement;
  const sourceElements = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll<HTMLElement>('*'))];
  const clonedElements = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>('*'))];
  const count = Math.min(sourceElements.length, clonedElements.length);

  for (let index = 0; index < count; index += 1) {
    const sourceElement = sourceElements[index];
    const clonedElement = clonedElements[index];
    const computed = window.getComputedStyle(sourceElement);
    clonedElement.removeAttribute('class');
    clonedElement.removeAttribute('style');
    clonedElement.style.setProperty('all', 'initial');

    for (const property of EXPORT_STYLE_PROPERTIES) {
      const sanitizedValue = sanitizeCssValue(property, computed.getPropertyValue(property));
      if (sanitizedValue) {
        clonedElement.style.setProperty(property, sanitizedValue);
      }
    }

    clonedElement.style.backgroundImage = 'none';
    clonedElement.style.filter = 'none';
    clonedElement.style.backdropFilter = 'none';
    clonedElement.style.webkitTextFillColor = sanitizeCssValue('color', computed.webkitTextFillColor || computed.color);
    clonedElement.style.textShadow = 'none';
    clonedElement.style.caretColor = sanitizeCssValue('color', computed.caretColor || computed.color);
    clonedElement.style.accentColor = sanitizeCssValue('color', computed.accentColor || computed.color);

    if (sourceElement instanceof HTMLInputElement) {
      clonedElement.setAttribute('value', sourceElement.value);
      if (sourceElement.checked) {
        clonedElement.setAttribute('checked', 'checked');
      } else {
        clonedElement.removeAttribute('checked');
      }
    }

    if (sourceElement instanceof HTMLTextAreaElement) {
      clonedElement.textContent = sourceElement.value;
    }

    if (sourceElement instanceof HTMLSelectElement && clonedElement instanceof HTMLSelectElement) {
      clonedElement.value = sourceElement.value;
    }
  }

  clonedRoot.style.position = 'fixed';
  clonedRoot.style.left = '-100000px';
  clonedRoot.style.top = '0';
  clonedRoot.style.margin = '0';
  clonedRoot.style.zIndex = '-1';
  clonedRoot.style.backgroundColor = 'rgb(255, 255, 255)';

  document.body.appendChild(clonedRoot);
  return clonedRoot;
}

export default function SlotplanungPage() {
  const [slotplanung, setSlotplanung] = useState<SlotplanungData | null>(null);
  const [summary, setSummary] = useState<ManagementSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [slotplanungDownloading, setSlotplanungDownloading] = useState(false);
  const [message, setMessage] = useState('');
  const [zoomPercent, setZoomPercent] = useState(100);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const slotplanungRef = useRef<HTMLDivElement | null>(null);

  const triggerCanvasDownload = async (canvas: HTMLCanvasElement, fileName: string) => {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), 'image/png');
    });

    if (!blob) {
      throw new Error('canvas_to_blob_failed');
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    console.log('download started', fileName, objectUrl.slice(0, 30));
    link.click();
    link.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [slotResp, summaryResp] = await Promise.all([
          fetch('/api/slotplanung', { cache: 'no-store' }),
          fetch('/api/slotplanung/summary', { cache: 'no-store' }),
        ]);

        const slotJson = (await slotResp.json()) as SlotplanungData;
        const summaryJson = (await summaryResp.json()) as ManagementSummaryData;

        setSlotplanung(slotJson);
        setSummary(summaryJson);
      } catch {
        setMessage('Daten konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const onCellChange = (rowIndex: number, columnKey: string, value: string) => {
    setSlotplanung((current) => {
      if (!current) {
        return current;
      }

      const rows = [...current.rows];
      rows[rowIndex] = {
        ...rows[rowIndex],
        [columnKey]: value,
      };

      return {
        ...current,
        rows,
      };
    });
  };

  const saveSlotplanung = async () => {
    if (!slotplanung) {
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/slotplanung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: slotplanung.rows }),
      });

      if (!response.ok) {
        throw new Error('save failed');
      }

      setMessage('Slotplanung erfolgreich gespeichert.');
    } catch {
      setMessage('Speichern fehlgeschlagen.');
    } finally {
      setSaving(false);
    }
  };

  const refreshSummary = async () => {
    setRefreshing(true);
    setMessage('');

    try {
      const response = await fetch('/api/slotplanung/summary/refresh', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('refresh failed');
      }

      const nextSummary = (await response.json()) as ManagementSummaryData;
      setSummary(nextSummary);
      setMessage('Management Summary aktualisiert.');
    } catch {
      setMessage('Aktualisieren fehlgeschlagen.');
    } finally {
      setRefreshing(false);
    }
  };

  const downloadSummary = async () => {
    const node = summaryRef.current;
    if (!node) {
      console.error('downloadSummary: summaryRef is null');
      return;
    }

    setDownloading(true);
    setMessage('');

    try {
      const exportNode = createSanitizedExportClone(node);
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(exportNode, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          logging: false,
        });
      } finally {
        exportNode.remove();
      }

      await triggerCanvasDownload(canvas, 'management-summary.png');
      setMessage('Management Summary als PNG heruntergeladen.');
    } catch (error) {
      console.error('downloadSummary failed', error);
      setMessage('Download fehlgeschlagen.');
    } finally {
      setDownloading(false);
    }
  };

  const downloadSlotplanung = async () => {
    const node = slotplanungRef.current;
    if (!node) {
      console.error('downloadSlotplanung: slotplanungRef is null');
      return;
    }

    console.log('downloadSlotplanung ref', node);

    setSlotplanungDownloading(true);
    setMessage('');

    try {
      const exportNode = createSanitizedExportClone(node);
      let canvas: HTMLCanvasElement;
      try {
        exportNode.style.width = `${node.scrollWidth}px`;
        exportNode.style.height = `${node.scrollHeight}px`;

        const scrollContainer = exportNode.querySelector<HTMLElement>('[data-slotplanung-scroll-container="true"]');
        if (scrollContainer) {
          scrollContainer.style.maxHeight = 'none';
          scrollContainer.style.height = 'auto';
          scrollContainer.style.overflow = 'visible';
        }

        canvas = await html2canvas(exportNode, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          logging: false,
          width: exportNode.scrollWidth,
          height: exportNode.scrollHeight,
        });
      } finally {
        exportNode.remove();
      }

      await triggerCanvasDownload(canvas, 'Management Summary.png');
      setMessage('Slotplanung als PNG heruntergeladen.');
    } catch (error) {
      console.error('downloadSlotplanung failed', error);
      setMessage('Download der Slotplanung fehlgeschlagen.');
    } finally {
      setSlotplanungDownloading(false);
    }
  };

  const yearColumns = slotplanung?.columns.filter((column) => /^y\d{4}$/.test(column.key)) ?? [];
  const visibleColumns =
    slotplanung?.columns.filter((column) => {
      const requiredKeys = [
        'slot_id',
        'kunde',
        'fahrzeug',
        'kommentar',
        'aquise_hg0',
        'pre_alignment_hg1',
        'konzept_hg2',
        'umsetzung_hg3',
      ];

      return requiredKeys.includes(column.key) || yearColumns.some((year) => year.key === column.key);
    }) ?? [];

  if (loading || !slotplanung || !summary) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Management Summary / Slotplanung</h1>
        <p className="mt-4 text-black/75">Lade Daten...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1500px] px-6 py-8 sm:px-10">
      <h1 className="text-3xl font-bold text-black sm:text-4xl">Management Summary / Slotplanung</h1>

      <h2 className="mt-6 text-2xl font-semibold text-black">Management Summary</h2>
      <div ref={summaryRef} className="mt-2 rounded-2xl border border-black bg-white p-4 shadow-sm">
        <div className="space-y-1 border-b border-black/10 pb-3">
          <p className="text-base font-semibold text-black">Management Summary Werksunikate (One-Off)</p>
          <p className="text-sm text-black/75">Stand 03/2026</p>
          <p className="text-sm font-semibold text-black">SLOTPLANUNG - KUNDENPROJEKTE</p>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[0.9fr_2.1fr]">
          <SummaryPieChart phaseCounts={summary.phaseCounts} />
          <SummaryBars years={summary.years} blocksByYear={summary.blocksByYear} sollByYear={summary.sollByYear} />
        </div>

        <div className="mt-3">
          <SummaryBusinessTable years={summary.years} rows={summary.businessCaseRows} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={refreshSummary}
          disabled={refreshing}
          className="rounded-lg border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? 'Aktualisiere...' : 'Aktualisieren'}
        </button>
        <button
          type="button"
          onClick={downloadSummary}
          disabled={downloading}
          className="rounded-lg border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? 'Erstelle PNG...' : 'Download'}
        </button>
      </div>

      <h2 className="mt-8 text-2xl font-semibold text-black">Slotplanung</h2>
      <div ref={slotplanungRef} className="relative mt-2 rounded-2xl border border-black bg-white p-3 shadow-sm">
        <SlotplanungTable
          columns={visibleColumns}
          rows={slotplanung.rows as SlotplanungRow[]}
          zoomScale={zoomPercent / 100}
          onCellChange={onCellChange}
        />

        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-lg border border-black/20 bg-white/95 px-2 py-1 shadow-sm">
          <button
            type="button"
            onClick={() => setZoomPercent((current) => Math.max(70, current - 10))}
            className="h-7 w-7 rounded-md border border-black/30 bg-white text-base font-semibold text-black transition hover:bg-neutral-100"
            aria-label="Zoom verkleinern"
          >
            -
          </button>
          <span className="w-12 text-center text-xs font-semibold text-black">{zoomPercent}%</span>
          <button
            type="button"
            onClick={() => setZoomPercent((current) => Math.min(150, current + 10))}
            className="h-7 w-7 rounded-md border border-black/30 bg-white text-base font-semibold text-black transition hover:bg-neutral-100"
            aria-label="Zoom vergrößern"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={saveSlotplanung}
          disabled={saving}
          className="rounded-lg border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Speichere...' : 'Speichern'}
        </button>
        <button
          type="button"
          onClick={downloadSlotplanung}
          disabled={slotplanungDownloading}
          className="rounded-lg border border-black bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {slotplanungDownloading ? 'Erstelle PNG...' : 'Download'}
        </button>
        {message ? <p className="text-sm text-black/75">{message}</p> : null}
      </div>
    </section>
  );
}
