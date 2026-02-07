import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const internalSecret = process.env.INTERNAL_API_SECRET;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxy(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxy(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxy(request, params, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxy(request, params, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  return proxy(request, params, 'DELETE');
}

async function proxy(
  request: NextRequest,
  params: Promise<{ path?: string[] }>,
  method: string
) {
  const { path } = await params;
  const pathSegments = path ?? [];
  const backendPath = pathSegments.length ? pathSegments.join('/') : '';
  const targetUrl = `${backendUrl.replace(/\/$/, '')}/${backendPath}`;

  const isPublicPath = backendPath === 'health';
  const headers = new Headers(request.headers);
  headers.delete('connection');

  if (!isPublicPath) {
    const token = await getToken({
      req: request as unknown as Parameters<typeof getToken>[0]['req'],
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token?.sub) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    headers.set('X-User-Id', token.sub);
    if (internalSecret) headers.set('X-Internal-Secret', internalSecret);
  }

  let body: string | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.text();
    } catch {
      body = undefined;
    }
  }

  const res = await fetch(targetUrl, {
    method,
    headers,
    body: body || undefined,
  });

  const responseHeaders = new Headers();
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() !== 'transfer-encoding') responseHeaders.set(k, v);
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204, headers: responseHeaders });
  }

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: res.status, headers: responseHeaders });
  } catch {
    return new NextResponse(text, { status: res.status, headers: responseHeaders });
  }
}
