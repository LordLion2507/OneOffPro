import { NextResponse } from 'next/server';
import { readSlotplanungData, writeSlotplanungRows } from '@/lib/slotplanung-storage';
import type { SlotplanungRow } from '@/lib/slotplanung';

export const runtime = 'nodejs';

export async function GET() {
  const data = await readSlotplanungData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { rows?: SlotplanungRow[] };

  if (!Array.isArray(payload.rows)) {
    return NextResponse.json({ error: 'rows is required' }, { status: 400 });
  }

  const data = await writeSlotplanungRows(payload.rows);
  return NextResponse.json({ ok: true, data });
}
