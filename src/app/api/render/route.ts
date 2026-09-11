import { NextRequest, NextResponse } from 'next/server';
import { renderTaskCards } from '@/lib/llm';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const taskId = body?.task_id;
    const targetLanguages = Array.isArray(body?.target_languages) && body.target_languages.length > 0
      ? body.target_languages
      : ['en', 'hi', 'ja'];

    let task = taskId ? taskStore.getTask(taskId) : null;
    if (!task && body?.packet) {
      task = body.packet;
    }

    if (!task) {
      return NextResponse.json(
        { status: 'error', error: 'Task not found in store and no packet provided in payload' },
        { status: 404 }
      );
    }

    const renders = await renderTaskCards(task, targetLanguages);
    if (task.task_id) {
      taskStore.saveRenders(task.task_id, renders);
    }

    return NextResponse.json({
      status: 'success',
      task_id: task.task_id,
      version: task.version,
      renders,
    });
  } catch (error: any) {
    console.error('[API /api/render] Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Rendering failed' },
      { status: 500 }
    );
  }
}
