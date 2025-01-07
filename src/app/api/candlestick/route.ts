import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const instrumentName = searchParams.get('instrument_name');
    const timeframe = searchParams.get('timeframe');
    const startTs = searchParams.get('start_ts');
    const endTs = searchParams.get('end_ts');

    if (!instrumentName || !timeframe || !startTs || !endTs) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const response = await fetch(
      'https://api.crypto.com/v2/public/get-candlestick?' +
      new URLSearchParams({
        instrument_name: instrumentName,
        timeframe: timeframe,
        start_ts: startTs,
        end_ts: endTs
      }).toString(),
      {
        headers: {
          'Accept': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`Crypto.com API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in candlestick API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candlestick data' },
      { status: 500 }
    );
  }
} 