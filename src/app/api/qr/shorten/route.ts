import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

const tokenStore = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 },
      );
    }

    const shortId = nanoid(8);
    tokenStore.set(shortId, token);

    return NextResponse.json({ shortId });
  } catch (error) {
    console.error('Error generating short ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate short ID' },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shortId = searchParams.get('id');

  if (!shortId) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400 },
    );
  }

  const token = tokenStore.get(shortId);
  if (!token) {
    return NextResponse.json(
      { error: 'Invalid or expired ID' },
      { status: 404 },
    );
  }

  return NextResponse.json({ token });
}
