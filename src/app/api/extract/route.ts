import { NextRequest, NextResponse } from 'next/server';
import { extractMeaningPacket } from '@/lib/llm';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transcript = body.transcript;

    if (!transcript) {
      return NextResponse.json(
        { status: 'error', error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const packet = await extractMeaningPacket(transcript);
    taskStore.saveTask(packet);

    return NextResponse.json({ status: 'success', packet });
  } catch (error: any) {
    console.error('[API /api/extract] Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Extraction failed' },
      { status: 500 }
    );
  }
}
