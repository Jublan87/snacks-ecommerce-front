import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { path: pathSegments } = await params;
  const qs = request.nextUrl.searchParams.toString();
  const upstream = `${process.env.API_URL}/admin/${pathSegments.join('/')}${qs ? `?${qs}` : ''}`;

  const isReadMethod = request.method === 'GET' || request.method === 'HEAD';
  const body = isReadMethod ? undefined : await request.text();

  const backendResponse = await fetch(upstream, {
    method: request.method,
    headers: {
      'Content-Type': request.headers.get('Content-Type') ?? 'application/json',
      Authorization: `Bearer ${token}`,
      ...(request.headers.get('x-forwarded-for')
        ? { 'X-Forwarded-For': request.headers.get('x-forwarded-for')! }
        : {}),
    },
    body,
  });

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      'Content-Type': backendResponse.headers.get('Content-Type') ?? 'application/json',
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxy(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxy(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxy(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxy(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  return proxy(request, context);
}
