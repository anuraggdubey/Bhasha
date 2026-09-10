import { NextRequest, NextResponse } from 'next/server';
import { taskStore } from '@/lib/taskStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get('id');

  if (taskId) {
    const task = taskStore.getTask(taskId);
    const renders = taskStore.getRenders(taskId);
    if (!task) {
      return NextResponse.json({ status: 'error', error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ status: 'success', task, renders });
  }

  const tasks = taskStore.getAllTasks();
  return NextResponse.json({ status: 'success', tasks });
}
