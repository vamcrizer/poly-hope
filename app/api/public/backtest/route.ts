import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const REPORT_PATH = path.join(process.cwd(), 'public', 'backtest_report.json');

export async function GET() {
  try {
    if (!fs.existsSync(REPORT_PATH)) {
      return NextResponse.json(
        {
          error: 'Backtest report not yet generated.',
          hint: 'Run scripts/backtest_report.py to generate the report.',
        },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(REPORT_PATH, 'utf-8');
    const data = JSON.parse(raw);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[/api/public/backtest] Failed to read report:', err);
    return NextResponse.json(
      { error: 'Failed to load backtest report.' },
      { status: 500 }
    );
  }
}
