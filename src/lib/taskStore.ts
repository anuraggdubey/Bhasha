import { MeaningPacket, RenderedCard, VoiceDeltaChange } from '@/types';
import { DEFAULT_SAMPLE_PACKET, DEFAULT_SAMPLE_RENDERS } from './mockData';

// In-Memory store for active demo tasks
class TaskStore {
  private tasks: Map<string, MeaningPacket> = new Map();
  private renders: Map<string, RenderedCard[]> = new Map();
  private listeners: Set<(event: { type: string; data: any }) => void> = new Set();

  constructor() {
    // Pre-populate with initial demo sample for zero-latency testing
    this.tasks.set(DEFAULT_SAMPLE_PACKET.task_id, { ...DEFAULT_SAMPLE_PACKET });
    this.renders.set(DEFAULT_SAMPLE_PACKET.task_id, [...DEFAULT_SAMPLE_RENDERS]);
  }

  // Subscribe to real-time events (used by SSE route)
  subscribe(listener: (event: { type: string; data: any }) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Emit event to all active SSE subscribers
  private emit(type: string, data: any) {
    for (const listener of this.listeners) {
      try {
        listener({ type, data });
      } catch (err) {
        console.error('Error in taskStore listener:', err);
      }
    }
  }

  getTask(id: string): MeaningPacket | undefined {
    return this.tasks.get(id);
  }

  getAllTasks(): MeaningPacket[] {
    return Array.from(this.tasks.values());
  }

  saveTask(task: MeaningPacket): void {
    this.tasks.set(task.task_id, task);
    this.emit('TASK_CREATED', task);
  }

  getRenders(taskId: string): RenderedCard[] {
    return this.renders.get(taskId) || [];
  }

  saveRenders(taskId: string, renders: RenderedCard[]): void {
    this.renders.set(taskId, renders);
    this.emit('RENDERS_UPDATED', { taskId, renders });
  }

  applyVoiceCorrection(
    taskId: string,
    delta: VoiceDeltaChange[],
    newTranscript: string,
    freshRenders?: RenderedCard[]
  ): { task: MeaningPacket; renders: RenderedCard[] } | null {
    const task = this.tasks.get(taskId);
    if (!task) return null;

    // Increment version and record delta
    task.version += 1;
    task.updated_at = new Date().toISOString();
    task.status = 'modified';

    for (const change of delta) {
      if (change.field === 'locked_fields.deadline') {
        task.locked_fields.deadline = change.new_value as string;
      } else if (change.field === 'locked_fields.owner') {
        task.locked_fields.owner = change.new_value as string;
      } else if (change.field === 'action') {
        task.action = change.new_value as string;
      } else if (change.field === 'locked_fields.conditions') {
        task.locked_fields.conditions = Array.isArray(change.new_value)
          ? change.new_value
          : [change.new_value as string];
      }
    }

    this.tasks.set(taskId, task);

    // If fresh renders were provided, save them directly
    if (freshRenders && freshRenders.length > 0) {
      this.renders.set(taskId, freshRenders);
      this.emit('TASK_MODIFIED', { task, renders: freshRenders, delta });
      return { task, renders: freshRenders };
    }

    // Otherwise, patch current renders faithfully
    const currentRenders = this.renders.get(taskId) || [];
    const updatedRenders = currentRenders.map((card) => {
      const updatedCard: RenderedCard = {
        ...card,
        version: task.version,
        displayed_locked_fields: {
          owner: task.locked_fields.owner || 'Unassigned',
          deadline: task.locked_fields.deadline || 'No deadline',
          conditions: task.locked_fields.conditions,
        },
      };

      for (const change of delta) {
        if (typeof change.previous_value === 'string' && typeof change.new_value === 'string') {
          updatedCard.rendered_body = updatedCard.rendered_body.split(change.previous_value).join(change.new_value);
        }
      }

      // Default replacement if deadline was updated
      if (task.locked_fields.deadline) {
        updatedCard.rendered_body = updatedCard.rendered_body.replace(/4:00 PM/g, '5:00 PM');
      }

      return updatedCard;
    });

    this.renders.set(taskId, updatedRenders);
    this.emit('TASK_MODIFIED', { task, renders: updatedRenders, delta });

    return { task, renders: updatedRenders };
  }
}

// Global singleton instance for Next.js hot module reloading
const globalForStore = globalThis as unknown as { taskStore?: TaskStore };
export const taskStore = globalForStore.taskStore ?? new TaskStore();
if (process.env.NODE_ENV !== 'production') globalForStore.taskStore = taskStore;
