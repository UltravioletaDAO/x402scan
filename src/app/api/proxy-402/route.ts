import { NextResponse, type NextRequest } from 'next/server';

const TARGET_HEADER = 'x-proxy-target';
const RESPONSE_HEADER_BLOCKLIST = new Set([
  'content-encoding',
  'transfer-encoding',
  'content-length',
]);
const REQUEST_HEADER_BLOCKLIST = new Set([
  'host',
  'content-length',
  TARGET_HEADER,
]);

async function proxy(request: NextRequest) {
  const targetValue = request.headers.get(TARGET_HEADER);

  if (!targetValue) {
    return NextResponse.json(
      { error: 'Missing x-proxy-target header' },
      { status: 400 }
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(targetValue);
  } catch {
    return NextResponse.json(
      { error: 'Invalid x-proxy-target header' },
      { status: 400 }
    );
  }

  const upstreamHeaders = new Headers();
  request.headers.forEach((value, key) => {
    if (!REQUEST_HEADER_BLOCKLIST.has(key.toLowerCase())) {
      upstreamHeaders.set(key, value);
    }
  });

  const method = request.method.toUpperCase();
  let body: ArrayBuffer | undefined;

  if (method !== 'GET' && method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  try {
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: upstreamHeaders,
      body,
    });

    const responseHeaders = new Headers();
    upstreamResponse.headers.forEach((value, key) => {
      if (!RESPONSE_HEADER_BLOCKLIST.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });
    responseHeaders.set(TARGET_HEADER, targetUrl.toString());

    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown upstream error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
