import { listOriginsWithResources } from '@/services/db/origin';
import { NextResponse } from 'next/server';

export async function GET() {
  const origins = await listOriginsWithResources();
  return NextResponse.json(origins);
}

