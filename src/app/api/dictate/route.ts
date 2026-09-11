import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithAssemblyAI } from '@/lib/assemblyai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    // Accept either 'audio' or 'file' key in the FormData
    const audioFile = (formData.get('audio') || formData.get('file')) as Blob | null;

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json(
        { status: 'error', error: 'No audio file provided or audio file is empty' },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = audioFile.type || 'audio/wav';

    const result = await transcribeWithAssemblyAI(buffer, mimeType);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API /api/dictate] Internal Error:', error);
    return NextResponse.json(
      { status: 'error', error: error.message || 'Internal transcription error' },
      { status: 500 }
    );
  }
}
