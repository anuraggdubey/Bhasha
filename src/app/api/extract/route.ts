import { NextRequest, NextResponse } from 'next/server';
import { extractMeaningPacket } from '@/lib/llm';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const transcript = body?.transcript;

    if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
      return NextResponse.json(
        { status: 'error', error: 'A valid non-empty transcript string is required' },
        { status: 400 }
      );
    }

    const packet = await extractMeaningPacket(transcript.trim());
    taskStore.saveTask(packet);

    const requiresDisambiguation = !packet.locked_fields.owner || !packet.locked_fields.deadline;

    return NextResponse.json({
      status: 'success',
      packet,
      requires_disambiguation: requiresDisambiguation,
      disambiguation_notice: requiresDisambiguation
        ? 'Some locked entities (assignee or deadline) were not detected in speech. Review required before dispatch.'
        : null,
    });
  } catch (error: any) {
    console.error('[API /api/extract] Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Extraction failed' },
      { status: 500 }
    );
  }
}
