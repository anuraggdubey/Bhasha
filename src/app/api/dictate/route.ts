import { NextRequest, NextResponse } from 'next/server';
import { transcribeWithAssemblyAI } from '@/lib/assemblyai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob | null;

    if (!audioFile) {
      return NextResponse.json(
        { status: 'error', error: 'No audio file provided in request' },
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
