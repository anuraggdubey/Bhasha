import { NextRequest, NextResponse } from 'next/server';
import { DispatchRecord } from '@/types';

// In-memory dispatch log for demo session
const dispatchHistory: DispatchRecord[] = [];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teammate_id, recipient_name, channel, language, headline } = body;

    const record: DispatchRecord = {
      id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      teammate_id: teammate_id || 'unknown',
      recipient_name: recipient_name || 'Teammate',
      channel: channel || 'whatsapp',
      language: language || 'en',
      headline: headline || 'Voice Task Relay',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: 'delivered',
    };

    dispatchHistory.unshift(record);

    return NextResponse.json({
      status: 'success',
      record,
      total_dispatches: dispatchHistory.length,
    });
  } catch (error: any) {
    console.error('Dispatch API error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Dispatch failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'success',
    dispatches: dispatchHistory.slice(0, 20),
  });
}
