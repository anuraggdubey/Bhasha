import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceDelta } from '@/lib/llm';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task_id, correction_transcript } = body;

    if (!task_id || !correction_transcript) {
      return NextResponse.json(
        { status: 'error', error: 'task_id and correction_transcript are required' },
        { status: 400 }
      );
    }

    const delta = parseVoiceDelta(correction_transcript);
    const updatedResult = taskStore.applyVoiceCorrection(task_id, delta, correction_transcript);

    if (!updatedResult) {
      return NextResponse.json(
        { status: 'error', error: 'Task not found to correct' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      updated_packet: updatedResult.task,
      renders: updatedResult.renders,
      delta,
    });
  } catch (error: any) {
    console.error('[API /api/correct] Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Correction update failed' },
      { status: 500 }
    );
  }
}
