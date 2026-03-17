import { NextResponse } from 'next/server';
import { refreshAndPersistSummary } from '@/lib/slotplanung-storage';

export const runtime = 'nodejs';

export async function GET() {
  // Always re-aggregate from slot planning to avoid serving stale summary snapshots.
  const generated = await refreshAndPersistSummary();
  return NextResponse.json(generated);
}
