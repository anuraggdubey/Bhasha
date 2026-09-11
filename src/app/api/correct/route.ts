import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceDelta, renderTaskCards } from '@/lib/llm';
import { transcribeWithAssemblyAI } from '@/lib/assemblyai';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let taskId: string | null = null;
    let correctionTranscript: string = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      taskId = formData.get('task_id') as string | null;
      const audioFile = (formData.get('audio') || formData.get('file')) as Blob | null;

      if (!audioFile) {
        return NextResponse.json(
          { status: 'error', error: 'Audio file is required for voice correction' },
          { status: 400 }
        );
      }

      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = audioFile.type || 'audio/wav';

      console.log('[API /api/correct] Transcribing correction audio with AssemblyAI...');
      const sttResult = await transcribeWithAssemblyAI(buffer, mimeType);
      correctionTranscript = sttResult.transcript;
    } else {
      const body = await req.json();
      taskId = body.task_id;
      correctionTranscript = body.correction_transcript || body.correction_text || '';
    }

    if (!taskId || !correctionTranscript) {
      return NextResponse.json(
        { status: 'error', error: 'task_id and correction_transcript (or audio) are required' },
        { status: 400 }
      );
    }

    const currentTask = taskStore.getTask(taskId);
    if (!currentTask) {
      return NextResponse.json(
        { status: 'error', error: `Task with id "${taskId}" not found in active store` },
        { status: 404 }
      );
    }

    // Extract delta differences
    const delta = await parseVoiceDelta(correctionTranscript, currentTask);

    // Compute preview of updated packet to pass to renderer
    const previewTask = JSON.parse(JSON.stringify(currentTask));
    previewTask.version += 1;
    for (const change of delta) {
      if (change.field === 'locked_fields.deadline') {
        previewTask.locked_fields.deadline = change.new_value;
      } else if (change.field === 'locked_fields.owner') {
        previewTask.locked_fields.owner = change.new_value;
      } else if (change.field === 'action') {
        previewTask.action = change.new_value;
      }
    }

    // Re-render multi-language cards with locked facts intact
    const freshRenders = await renderTaskCards(previewTask, ['en', 'hi', 'ja']);

    // Persist changes and emit SSE TASK_MODIFIED event
    const updatedResult = taskStore.applyVoiceCorrection(
      taskId,
      delta,
      correctionTranscript,
      freshRenders
    );

    if (!updatedResult) {
      return NextResponse.json(
        { status: 'error', error: 'Failed to apply voice correction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'success',
      transcript: correctionTranscript,
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
