import { NextResponse } from 'next/server';
import { refreshAndPersistSummary } from '@/lib/slotplanung-storage';

export const runtime = 'nodejs';

export async function POST() {
  const summary = await refreshAndPersistSummary();
  return NextResponse.json(summary);
}
