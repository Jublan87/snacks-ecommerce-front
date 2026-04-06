import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const incoming = await request.formData();
  const fd = new FormData();

  for (const [key, value] of incoming.entries()) {
    fd.append(key, value);
  }

  const backendResponse = await fetch(`${process.env.API_URL}/admin/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type intentionally omitted — let fetch set multipart/form-data with boundary
    },
    body: fd,
  });

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: {
      'Content-Type': backendResponse.headers.get('Content-Type') ?? 'application/json',
    },
  });
}
