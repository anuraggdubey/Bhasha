import { NextRequest, NextResponse } from 'next/server';
import { renderTaskCards } from '@/lib/llm';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const taskId = body.task_id;
    const targetLanguages = body.target_languages || ['en', 'hi', 'ja'];

    let task = taskStore.getTask(taskId);
    if (!task) {
      return NextResponse.json(
        { status: 'error', error: 'Task not found' },
        { status: 404 }
      );
    }

    const renders = await renderTaskCards(task, targetLanguages);
    taskStore.saveRenders(taskId, renders);

    return NextResponse.json({ status: 'success', task_id: taskId, renders });
  } catch (error: any) {
    console.error('[API /api/render] Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Rendering failed' },
      { status: 500 }
    );
  }
}
